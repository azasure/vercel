import HttpError from '@wasp/core/HttpError.js'

export const tradeCardOrCryptocurrency = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  // Implement the trade logic here
}

export const withdrawFunds = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const { userId, amount } = args;

  const user = await context.entities.User.findUnique({
    where: { id: userId }
  });

  if (!user) { throw new HttpError(404) };

  const wallet = await context.entities.Wallet.findUnique({
    where: { userId: user.id }
  });

  if (!wallet) { throw new HttpError(404) };

  if (wallet.balance < amount) { throw new HttpError(400, 'Insufficient funds') };

  const transaction = await context.entities.Transaction.create({
    data: {
      type: 'withdrawal',
      details: `Withdrawal from wallet to bank account`,
      status: 'pending',
      user: { connect: { id: user.id } }
    }
  });

  const updatedWallet = await context.entities.Wallet.update({
    where: { id: wallet.id },
    data: { balance: wallet.balance - amount }
  });

  return transaction;
}
