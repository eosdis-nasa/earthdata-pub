# Earthdata Pub

This is the core code repository for Earthdata Pub (EDPub).

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for instruction for contributing to
the EDPub project. Be sure to read that before submitting pull requests.

Also see [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md).

## Organization

EDPub consists of an API application, a front-end application (dashboard), extension modules, 
and a file upload module.

## Building and running locally

Install the node version specified in .nvmrc to build and run EDPub locally. 
We recommend using [NVM](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) to install and manage node versions.

Clone the main EDPub repos.

```bash
git clone git@github.com:eosdis-nasa/earthdata-pub-api.git
git clone git@github.com:eosdis-nasa/earthdata-pub-dashboard.git
git clone git@github.com:eosdis-nasa/earthdata-pub-modules.git
git clone git@github.com:eosdis-nasa/earthdata-pub-upload.git
```

VPNs and work networks can prevent ssh cloning. If you are required to use VPN,
clone over http, for example:
<https://github.com/eosdis-nasa/earthdata-pub-api.git>

Install, build, and run using npm.

```bash
nvm use
cd ../earthdata-pub-api
npm install
npm run build:local
cd ../earthdata-pub-dashboard
npm install
npm run start-dev
```

Applications should be available at:

| Application | URL |
| --- | --- |
| API | <http://localhost:8080> |
| Dashboard | <http://localhost:3000> |

## Open source release

During the open source approval process, EDPub was required to submit a zipped
code base. To create that zip, use this command in the directory above the
earthdata-pub repos:

```bash
zip -r earthdata-pub/edpub-1.0.0.zip . -x */\.* *.git* \.* *.zip *.bak *.swp *.back *.merge **/node_modules/**\* **/bower_components/**\* **/dist/**.* **earthdata-pub**
```

## References

- EOSDIS Slack Channel: #earthdatapub
- EDPub Wiki: [https://wiki.earthdata.nasa.gov/display/EDPUB/Earthdata+Pub+Home](https://wiki.earthdata.nasa.gov/display/EDPUB/Earthdata+Pub+Home)
- EDPub Roadmap: [https://wiki.earthdata.nasa.gov/display/EDPUB/EDPub+Feature+Roadmap](https://wiki.earthdata.nasa.gov/display/EDPUB/EDPub+Feature+Roadmap)