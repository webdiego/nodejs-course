import crypto from 'crypto';

export const createPswResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(resetToken).digest('hex');
  return hash;
};
