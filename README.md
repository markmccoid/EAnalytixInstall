# Analytix Install and Upgrade Application

The purpose of this application is to act as an installer/upgrader for Analytix.  It will contain the latest release of Analytix in its data directory.

The structure of the application when packaged for distribution:

AnalytixInstaller/
├── data/
│   ├── QVD/
│   ├── QVW/
│   ├── SOURCE/
│   ├── _biconnection.txt_
│   └── _coreconnection.txt_
└── _otherElectronDirs_/
└── _otherElectronFIle (.exe, .dll, etc)_
----
The structure of the development environment:
EAnalytixInstaller/
├── app/
├── assets/
├── data/
├── dist/
├── images/
├── node_modules/
├── public/
├── src/
│   ├── ...
│   ├── ...
│   └── ...
└-----------

