import cron from "node-cron";
import * as emailDigestServices from "./emailDigestServices.js";
import { rateLimitedSender } from "./rateLimitedSender.js";

export const scheduleEmailDigest = async () => {
  const { dailyDigest, weeklyDigest, monthlyDigest } =
    await emailDigestServices.getUsersForDigest();
  if (!dailyDigest && !weeklyDigest && !monthlyDigest) {
    throw new CustomError("No users found for email digest", 404);
  }
  // Get the current date and time  
  const today = new Date();
  const currentDay = today.getDay();
  const currentDate = today.getDate();

  let job = [];
  //runs every day
  job.push(
    ...dailyDigest.map(
      (user) => () =>
        emailDigestServices.sendEmailDigest(user.userId, user.frequency)
    )
  );
  // Runs every monday
  if (currentDay === 1) {
    job.push(
      ...weeklyDigest.map(
        (user) => () =>
          emailDigestServices.sendEmailDigest(user.userId, user.frequency)
      )
    );
  }
  // Runs every frist day of the month
  if (currentDate === 1) {
    job.push(
      ...monthlyDigest.map(
        (user) => () =>
          emailDigestServices.sendEmailDigest(user.userId, user.frequency)
      )
    );
  }

  await rateLimitedSender(job, 4, 12000);
};

//works every day at 10:30 AM
cron.schedule("30 10 * * *", async () => {
  await scheduleEmailDigest();
});
