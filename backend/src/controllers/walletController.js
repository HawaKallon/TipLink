// const { Keypair, Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
// const nodemailer = require('nodemailer');

// exports.createWallet = async (req, res) => {
//   const { email, amount } = req.body;

//   const keypair = Keypair.generate();
//   const walletAddress = keypair.publicKey.toString();

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'hawakallon58@gmail.com',
//       pass: 'Rukiakallon8'
//     }
//   });

//   const mailOptions = {
//     from: 'hawakallon58@gmail.com',
//     to: email,
//     subject: 'You have received cryptocurrency!',
//     text: `You have received ${amount} SOL. Access your funds here: http://localhost:3001/claim?wallet=${walletAddress}`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send(error.toString());
//     }
//     res.json({ walletAddress });
//   });
// };

// exports.transferFunds = async (req, res) => {
//   const { walletAddress, recipientWallet } = req.body;

//   const connection = new Connection('https://api.mainnet-beta.solana.com');
//   const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(walletAddress));

//   const transaction = new Transaction().add(
//     SystemProgram.transfer({
//       fromPubkey: senderKeypair.publicKey,
//       toPubkey: new PublicKey(recipientWallet),
//       lamports: 1000000000, // 1 SOL (example amount)
//     })
//   );

//   const signature = await connection.sendTransaction(transaction, [senderKeypair]);
//   res.json({ signature });
// };



require('dotenv').config();
const { Keypair, Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const nodemailer = require('nodemailer');

exports.createWallet = async (req, res) => {
  const { email, amount } = req.body;

  const keypair = Keypair.generate();
  const walletAddress = keypair.publicKey.toString();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'You have received cryptocurrency!',
    text: `You have received ${amount} SOL. Access your funds here: http://localhost:3001/claim?wallet=${walletAddress}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email: ' + error.toString());
    }
    console.log('Email sent:', info.response);
    res.json({ walletAddress });
  });
};

exports.transferFunds = async (req, res) => {
  const { walletAddress, recipientWallet } = req.body;

  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(walletAddress));

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey: new PublicKey(recipientWallet),
      lamports: 1000000000, // 1 SOL (example amount)
    })
  );

  try {
    const signature = await connection.sendTransaction(transaction, [senderKeypair]);
    res.json({ signature });
  } catch (error) {
    console.error('Error transferring funds:', error);
    res.status(500).send('Error transferring funds: ' + error.toString());
  }
};
