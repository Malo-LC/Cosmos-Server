import React from 'react';
import AlertNotification from '../../components/AlertNotification';
import Migrate014 from './migrate014';

export default function renderAlerts(coStatus, config) {
  const alerts = [];

  if (!coStatus.database) {
    alerts.push(
      <AlertNotification
        severity="error"
        message="Database cannot connect, this will impact multiple feature of Cosmos. Please fix ASAP!"
      />
    );
  }

  if (coStatus.letsencrypt) {
    alerts.push(
      <AlertNotification
        severity="error"
        message="You have enabled Let's Encrypt for automatic HTTPS Certificate. You need to provide the configuration with an email address to use for Let's Encrypt in the configs."
      />
    );
  }

  if (coStatus.backup_status !== '') {
    alerts.push(<AlertNotification severity="error" message={coStatus.backup_status} />);
  }

  if (coStatus.LetsEncryptErrors && coStatus.LetsEncryptErrors.length > 0) {
    alerts.push(
      <AlertNotification
        severity="error"
        message="There are errors with your Let's Encrypt configuration or one of your routes, please fix them as soon as possible:"
        additionalComponent={
          <div>
            {coStatus.LetsEncryptErrors.map((err, i) => (
              <div key={i}> - {err}</div>
            ))}
          </div>
        }
      />
    );
  }

  if (coStatus.newVersionAvailable) {
    alerts.push(
      <AlertNotification
        severity="warning"
        message="A new version of Cosmos is available! Please update to the latest version to get the latest features and bug fixes."
      />
    );
  }

  if (!coStatus.hostmode && config) {
    alerts.push(
      <AlertNotification
        severity="warning"
        message="Your Cosmos server is not running in the docker host network mode. It is recommended that you migrate your install."
        additionalComponent={<Migrate014 config={config} />}
      />
    );
  }

  if (coStatus.needsRestart) {
    alerts.push(
      <AlertNotification
        severity="warning"
        message="You have made changes to the configuration that require a restart to take effect. Please restart Cosmos to apply the changes."
      />
    );
  }

  if (coStatus.domain) {
    alerts.push(
      <AlertNotification
        severity="error"
        message="You are using localhost or 0.0.0.0 as a hostname in the configuration. It is recommended that you use a domain name or an IP instead."
      />
    );
  }

  if (!coStatus.docker) {
    alerts.push(
      <AlertNotification
        severity="error"
        message="Docker is not connected! Please check your docker connection."
        additionalComponent={
          <>
            <br />
            Did you forget to add <pre>-v /var/run/docker.sock:/var/run/docker.sock</pre> to your docker run command?
            <br />
            if your docker daemon is running somewhere else, please add <pre>-e DOCKER_HOST=...</pre> to your docker run
            command.
          </>
        }
      />
    );
  }

  return alerts;
}
