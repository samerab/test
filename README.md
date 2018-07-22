# ci4-web-ui

Dieses Projekt wurde mit dem [Angular CLI](https://github.com/angular/angular-cli) in Version 1.0.3 erzeugt, verwendet inzwischen aber Version 6 des CLI.

# Vorbereitung

Dieses Projekt benötigt zum erstellen, sowhl Node (Version 8) inklusive NPM, als auch das Angular CLI.

## Node

``` Bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
sudo apt-get install -y nodejs
```

## CLI

``` Bash
sudo npm install -g @angular/cli
```
## VS Code

Als Editor empfiehlt sich VS Code. 

Um volle Unterstützung für Angular in VS Code zu nutzen sollte die Erweiterungssammlung **'Angular Essentials'** (johnpapa.angular-essentials) installiert werden.

# Abhängigkeiten Installieren

Nachdem klonen des Repositories sollte zunächst sicher gestellt werden, das alle Abhängigkeiten heruntergeladen wurden:

``` Bash
npm install
```

# Entwicklungsserver

Mit dem Befehl `ng serve` wird ein lokaler Entwicklungsserver gestartet. Rufe im Browser die Url `http://localhost:4200/` auf, um eine automatisch aktualliserende Version des ci4-web-ui Projektes zu sehen.
Dieser Server ist zunächst nur lokal erreichbar. Damit das Interface auch von extern erreichbar ist, kann der Parameter `--host xxx.xxx.xxx.xxx` genutzt werden, um auch externe Verbindungen zuzulassen.

# Code Erzeugung

Mit Hilfe des CLI können Komponenten sehr leicht erzeugt werden, hierfür reicht der Befehl `ng generate component component-name`. 
Es können aber auch noch viele andere Elemente der Angular Anwendung generiert werden: `ng generate directive|pipe|service|class|module`.

# Build

Zum bauen des Projektes muss `ng build` ausgeführt werden. Das Build wird im Ordner `dist/` abgelegt. Zum erstellen eines produktiven Build, kann die flag `-prod` hinzugefügt werden.

# Unit Tests

Um die [Karma](https://karma-runner.github.io) Unit Tests auszuführen muss lediglich `ng test` ausgeführt werden. Bei Änderungen im Code werden die Tests automatisch wiederholt.

# CORS

Um gegen ein laufendes REST Interface auf einer Systemzentrale zu entwickeln ist die Einrichtung von CORS nötig. 

## Einrichtung Web UI CORS

Auf Seiten der Web UI muss hierfür eine Umgebung angelegt werden, die auf das REST Interface der jeweiligen Systemzentrale zeigt. 

src/environments/environment.cors.ts:

``` javascript
export const environment = {
  production: false,
  baseUrl: "https://<backend-ip>"
};
```

## Einrichtung Systemzentrale CORS

Damit die Systemzentrale ihr REST Interface mit CORS Headern bereitstellt, müssen die Dateien aus dem [ci-lighttpd-cors](https://git.eckelmann.de/elds/tools/ci-lighttpd-cors) Repository auf die Systemzentrale kopiert werden. z.B.:

``` bash
  git clone git@git.eckelmann.de:elds/tools/ci-lighttpd-cors.git
  cd ci-lighttpd-cors
  cp -R etc/* <nfs_root>/etc
  cp -R opt/* <nfs_root>/opt
```

Die Änderungen können in der Systemzentrale mit '`s reload lighttpd`' angewendet werden.

## Web-UI mit CORS starten

Um nun einen Angular Entwicklungsserver mit der CORS Umgebung zu starten reicht folgender Befehl:

```
npm run start:cors
```

Optional kann dieser Befehl erweitert werden, um auch von anderen Maschinen auf den Frontend zuzugreifen:

```
npm run start:cors -- --host <frontend-ip>
```

# End-to-End Tests

## Vorbereitung

Siehe CORS

## Ausführung

Folgender Befehl starten die E2E Tests auf einem lokalen WebInterface, das die REST Schnittstelle der 'cors' Umgebung nutzt:

> npm run e2e:cors

Mit dem folgenden Befehl, kann der E2E Test direkt auf dem WebInterface eines anderen Rechners gestartet werden. Zu beachten ist, dass die Version auf dem Remote Rechner sich von der Version der Tests unterscheiden kann, was zu Fehlern führen kann.

> npm run e2e -- --serve=false --base-href=https://10.0.28.21/
