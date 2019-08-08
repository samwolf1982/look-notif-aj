## Setup
Run `docker-compose build`.
## Start
Run `docker-compose up` to create and start the `web`, `nginx` and `db` containers. The app should then be running on your docker daemon on standard http port 80 (On OS X you can use `boot2docker ip` to find out the IP address).
## Notes on boot2docker

It [appears](https://github.com/boot2docker/boot2docker/issues/290) that boot2docker (OS X, Windows) currently does not automatically sync the system clock with the host system after a host resumes from sleep. This becomes a problem due to the way nodemon detects file changes. That might cause it to go bananas, if the clocks on both systems are "too much" out of sync. Until this is fixed, you might use [this workaround](https://github.com/boot2docker/boot2docker/issues/290#issuecomment-62384209) or simply do a manual sync via

```bash
/usr/local/bin/boot2docker ssh sudo ntpclient -s -h pool.ntp.org
```
