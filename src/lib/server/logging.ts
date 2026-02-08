import chalk, { type ChalkInstance } from 'chalk';
import Configuration from './config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const levelColors: Record<LogLevel, ChalkInstance> = {
	info: chalk.cyan,
	warn: chalk.yellow,
	error: chalk.red,
	debug: chalk.gray
};

export function log(level: LogLevel, message: string, ...args: unknown[]): void {
	const color = levelColors[level];
	const timestamp = chalk.dim(new Date().toLocaleString());
	console.log(`${timestamp} ${color(`[${level.toUpperCase()}]`)} ${message}`, ...args);
}

// Convenience wrappers
export const Logger = {
	info: (msg: string, ...a: unknown[]) => log('info', msg, ...a),
	warn: (msg: string, ...a: unknown[]) => log('warn', msg, ...a),
	error: (msg: string, ...a: unknown[]) => log('error', msg, ...a),
	debug: (msg: string, ...a: unknown[]) => log('debug', msg, ...a),
	// VERBOSE: only log this stuff if config.verbose is true
	verbose: (msg: string, ...a: unknown[]) => Configuration.verbose && log('debug', msg, ...a)
};
