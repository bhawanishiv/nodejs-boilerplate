import rateLimit from 'express-rate-limit';

interface RateLimitOptions {
  windowMs?: number;
  max?: number;
  skipSuccessfulRequests?: boolean;
}

export const withRateLimit = ({
  windowMs = 15 * 60 * 1000,
  max = 20,
  skipSuccessfulRequests = true,
}: RateLimitOptions): ReturnType<typeof rateLimit> => {
  return rateLimit({
    windowMs,
    max,
    skipSuccessfulRequests,
  });
};
