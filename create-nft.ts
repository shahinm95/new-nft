import { createNft,fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired , getExplorerLink, getKeypairFromFile  } from "@solana-developers/helpers";
import { createUmi  } from "@metaplex-foundation/umi-bundle-defaults";
import {Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import {generateSigner, keypairIdentity, percentAmount, publicKey} from "@metaplex-foundation/umi"
 

const connection = new Connection(clusterApiUrl("devnet"));
const user = await getKeypairFromFile() //if we don't specify anything here it will use id.json which is in our home folder

await airdropIfRequired(connection, user.publicKey, 1 *LAMPORTS_PER_SOL, 0.5 *LAMPORTS_PER_SOL);
 
console.log("loaded user" , user.publicKey.toBase58() );

//we talk to metaplaces tools via Umi , soo lets define Umi
const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata())

//this is the copy of user but in format that umi uses 
const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log("set up Umi isntance for user")

const collectionAddress = publicKey("GXS28bZ2cCCvCEf4ZUYJj9KaC5GApzok1fFHV9x9hpFp"); // this is a function turns publickey to umi version of it


console.log("creating nft...");

const mint = generateSigner(umi);
const transaction = await createNft(umi, {
    mint ,
    name : "My nft",
    symbol : "MN",
    uri : "https://raw.githubusercontent.com/shahinm95/new-nft/refs/heads/main/raw/raw2.json",
    sellerFeeBasisPoints : percentAmount(0),
    isCollection: false,
    collection : {
        key : collectionAddress,
        verified: false,
    }
})

await transaction.sendAndConfirm(umi);

const createdNft = await fetchDigitalAsset(umi , 
    mint.publicKey
)

console.log(` created nft ! address is ${getExplorerLink("address", createdNft.mint.publicKey , "devnet")}`)

//npx esrun create-nft.ts

// created at this address : https://explorer.solana.com/address/6VdJUcNEBmBzaE3rjJfSeaN9X9s3f58P9nKVK6D45o7w?cluster=devnet