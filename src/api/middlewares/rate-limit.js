import rateLimit from 'express-rate-limit';

export const withRateLimit = ({
  windowMs = 15 * 60 * 1000,
  max = 20,
  skipSuccessfulRequests = true,
}) => {
  return rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests,
  });
};
