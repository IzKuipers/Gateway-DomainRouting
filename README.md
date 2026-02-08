# Gateway Domain Routing

This project is written for the Gateway SRV05 server of my home infrastructure. The Gateway server is responsible for receiving the incoming HTTP traffic and routing it to the various servers in the infrastructure. Currently this routing is handled with a bash file and a handful of text files each containing a list of (sub-)domains, but I'd like to be able to manage these domains from my web browsers so that I don't have to crack open a terminal every time I want to reroute a domain or whatever the case may be.

The routing works by having an nginx instance running on the Gateway server. This nginx instance has a bunch of server blocks for each of the subdomains listed in the aforementioned text files. The HTTP traffic is routed to, say, Sacruda SRV02, which has its own nginx instance, with server blocks that match the domains set on the gateway, so that the traffic is routed to the proper service or wwwroot inside the target server.

```
Client -> SRV05 nginx -> SRV02 nginx -> Service
```

## Author

Izaak Kuipers <izaak.kuipers@gmail.com>

## License

MIT
