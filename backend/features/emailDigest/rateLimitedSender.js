export const rateLimitedSender = async (
  emailJob,
  batchSize = 5,
  timeInterval = 10000
) => {;
  for (let i = 0; i < emailJob.length; i += batchSize) {
    const batch = emailJob.slice(i, i + batchSize);
    const result = await Promise.allSettled(batch.map((email) => email()));
    result.forEach((res, index) => {
        const userIndex = i + index;
        if (res.status === "fulfilled") {
          console.log(`✅ Email ${userIndex + 1} sent successfully`);
        } else {
          console.error(`❌ Email ${userIndex + 1} failed:`, res.reason);
        }
      });
      
    if (i + batchSize < emailJob.length) {
      await new Promise((resolve) => setTimeout(resolve, timeInterval));
    }
  }
};
