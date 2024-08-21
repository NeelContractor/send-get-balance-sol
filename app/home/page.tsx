"use client"
import { Keypair, PublicKey } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { useState } from "react"
import nacl from "tweetnacl";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  const [mnemonic, setMnemonic] = useState<string | null>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [publicKeys, setPublicKeys] = useState<PublicKey>([]);

  const  handleOnClick = async () => {
      const mn = await generateMnemonic();
      setMnemonic(mn);
  }

  const handleOnClickAddWallet = async () => {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const deriveSeed = derivePath(path, seed.toString('hex')).key;
      const secret = nacl.sign.keyPair.fromSeed(deriveSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      setCurrentIndex(currentIndex + 1);
      setPublicKeys([...publicKeys, keypair.publicKey]);

      router.push('/dashborad');
  }


  return (
    <div className="grid justify-center">
      <button onClick={handleOnClick}>Create Mnemonic Phrase</button>
      {mnemonic === null ? null : <div className="w-full">{mnemonic}</div>}
      <div>
        <button onClick={handleOnClickAddWallet}>Add Account</button>
        {publicKeys === null ? <></> : publicKeys.map(p => <div>
          {p.toBase58()}
        </div>)}
      </div>
    </div>
  )
}
