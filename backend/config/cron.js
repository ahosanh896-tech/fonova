import corn from "node-cron";
import userModel from "../models/userModel.js";

const startCronJobs = () => {
  corn.schedule("*/10 * * * *", async () => {
    try {
      await userModel.updateMany(
        { verifyOtpExpireAt: { $lt: new Date() } },
        {
          $set: {
            verifyOtp: null,
            verifyOtpExpireAt: null,
          },
        },
      );
    } catch (error) {
      console.log("CRON ERROR:", error);
    }
  });
};

export default startCronJobs;
