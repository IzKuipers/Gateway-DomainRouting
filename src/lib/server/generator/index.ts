import { writeFile } from 'fs/promises';
import { DomainHandler } from '../db/handlers/domain';
import { ServerHandler } from '../db/handlers/server';
import type { GatewayDomain } from '../models/domain';
import type { GatewayServer } from '../models/server';
import Configuration from '../config';
import { AuditLogHandler } from '../db/handlers/auditlog';
import { CommandResult } from '$lib/result';
import { exec } from 'child_process';

export class Generator {
	static async generateConfiguration(): Promise<CommandResult<string>> {
		try {
			let result = `# GDR CONFIG GENERATION -- DO NOT MODIFY\n`;
			result += '#\n';
			result += `# Generated: ${new Date().toISOString()}\n`;

			const servers = await ServerHandler.getAllSerializable();

			for (const server of servers) {
				if (!server.enabled) continue; // Skip disabled servers

				result += await this.generateServerConfig(server);
			}

			result += `       
# ===== Default server - reject all other domains =====

server {
    listen 80 default_server;
    server_name _;
    return 302 https://error.walledgarden.nl/?server=SRV05;
}`;

			return CommandResult.Ok<string>(result);
		} catch (e) {
			return CommandResult.Error(`Failed to generate NGiNX configuration: ${e}`);
		}
	}

	static async generateServerConfig(server: GatewayServer) {
		const domains = await DomainHandler.getDomainsOfServer(server._id.toString());

		let result = `\n# ==== DOMAINS FOR ${server.serverName} ${server.displayName} ====\n`;

		for (const domain of domains) {
			result += await this.generateDomainConfig(domain, server);
		}

		return result;
	}

	static async generateDomainConfig(domain: GatewayDomain, server: GatewayServer) {
		return `
server {
    listen 80;
    server_name ${domain.value};

    add_header X-Infrastructure-Node "${server.serverName}" always;

    location / {
        proxy_pass http://${server.address}:${server.port}/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Request-Id $http_x_request_id;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass_request_headers on;
        proxy_set_header X-Infrastructure-Node "${server.serverName}";
    }

    client_max_body_size 100M;
}
`;
	}

	static async updateNGiNX(auditor: string): Promise<CommandResult<string>> {
		const configuration = await this.generateConfiguration();

		if (!configuration.success) return configuration;

		try {
			await writeFile(Configuration.outputFile, configuration.result!, 'utf-8');
			await AuditLogHandler.Audit(auditor, `Freshly deployed NGiNX`);

			const restartResult = await this.restartNGiNX();

			if (restartResult !== 0) return CommandResult.Error(`NGiNX restart failed with an exit code of ${restartResult}.`);

			return CommandResult.Ok<string>(configuration.result!, 'Configuration updated successfully');
		} catch (e) {
			return CommandResult.Error(`Failed to update NGiNX: ${e}`);
		}
	}

	static async restartNGiNX(): Promise<number | null> {
		return new Promise((r) => {
			const cp = exec(Configuration.nginxRestartCommand);

			console.log(cp);

			cp.once('exit', () => r(cp.exitCode));
		});
	}
}
