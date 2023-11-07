# Earthdata Pub

This is the core code repository for Earthdata Pub (EDPub).

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for instruction for contributing to
the EDPub project. Be sure to read that before submitting pull requests.

Also see [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md).

## Organization

EDPub consists of an API application, three front-end applications (overview,
dashboard, and forms), and modules.

## Building and running locally

Clone the main EDPub repos.

```bash
git clone git@github.com:eosdis-nasa/earthdata-pub-api.git
git clone git@github.com:eosdis-nasa/earthdata-pub-upload.git
git clone git@github.com:eosdis-nasa/earthdata-pub-dashboard.git
git clone git@github.com:eosdis-nasa/earthdata-pub-forms.git
git clone git@github.com:eosdis-nasa/earthdata-pub-overview.git
```

VPNs and work networks can prevent ssh cloning. If you are required to use VPN,
clone over http, for example:
<https://github.com/eosdis-nasa/earthdata-pub-overview.git>

Install, build, and run using npm.

```bash
cd api
npm install
npm run build:local
npm run start:detached
cd ../upload
npm install
npm run build
cd ../dashboard
npm install
npm run start-dashboard
cd ../forms
npm install
npm run start-forms
cd ../overview
npm install
npm run serve
```

Applications will be available at:

| Application | URL |
| --- | --- |
| API | <http://localhost:8080> |
| Dashboard | <http://localhost:3000> |
| Forms | <http://localhost:8081> |
| Overview | <http://localhost:8082> |

The Overview picks the next highest port, so the port may be different.

## Open source release

During the open source approval process, EDPub was required to submit a zipped
code base. To create that zip, use this command in the directory above the
earthdatapub repos:

```bash
zip -r earthdata-pub/edpub-1.0.0.zip . -x */\.* *.git* \.* *.zip *.bak *.swp *.back *.merge **/node_modules/**\* **/bower_components/**\* **/dist/**.* **earthdata-pub**
```
