require('dotenv').config();
const { TipLink } = require('@tiplink/api');
const nodemailer = require('nodemailer');

exports.createWallet = async (req, res) => {
  const { email, amount } = req.body;

  try {
    // Create a new TipLink
    const tiplink = await TipLink.create();

    // Configure nodemailer transporter
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
      text: `You have received ${amount} SOL. Access your funds here: ${tiplink.url.toString()}`
    };

    // Send email using nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).send(error.toString());
      }
      console.log('Email sent:', info.response);
      res.json({ walletAddress: tiplink.keypair.publicKey.toBase58() });
    });
  } catch (error) {
    console.error('Error creating TipLink:', error);
    res.status(500).send(error.toString());
  }
};

exports.transferFunds = async (req, res) => {
  const { walletAddress, recipientWallet } = req.body;

  try {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(walletAddress));

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: new PublicKey(recipientWallet),
        lamports: 1000000000, // 1 SOL (example amount)
      })
    );

    const signature = await connection.sendTransaction(transaction, [senderKeypair]);
    res.json({ signature });
  } catch (error) {
    console.error('Error transferring funds:', error);
    res.status(500).send('Error transferring funds: ' + error.toString());
  }
};
