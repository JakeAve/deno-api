export enum StartupSequence {
  DEPENDENCIES_LOADED = "1",
  ENVIRONMENT_READY = "2",
  DATABASE_CONNECTED = "3",
  LISTENING_FOR_REQUESTS = "4",
}

const sequenceLength = Object.keys(StartupSequence).length;

enum Colors {
  BrightCyan = " \u001b[36;1m",
  BrightGreen = " \u001b[32;1m",
  BrightRed = " \u001b[31;1m",
  Reset = "\u001b[0m",
}

export const logStartupSequence = (
  sequenceNumber: StartupSequence,
  message: string = ""
) => {
  let log = `${Colors.BrightCyan}[${sequenceNumber}/${sequenceLength}] `;
  switch (sequenceNumber) {
    case StartupSequence.DEPENDENCIES_LOADED:
      log += "Loaded dependencies";
      break;
    case StartupSequence.ENVIRONMENT_READY:
      log += "Loaded environment variables";
      break;
    case StartupSequence.DATABASE_CONNECTED:
      log += "Connected to database";
      break;
    case StartupSequence.LISTENING_FOR_REQUESTS:
      log += "Listening for requests";
      break;
    default:
      log += "Unknown sequence number";
  }
  console.log(`${log}${message && " " + message}${Colors.Reset}`);
};
