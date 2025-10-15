import {  findMetadataPda, mplTokenMetadata, verifyCollectionV1 } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired , getExplorerLink, getKeypairFromFile  } from "@solana-developers/helpers";
import { createUmi  } from "@metaplex-foundation/umi-bundle-defaults";
import {Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { keypairIdentity, publicKey} from "@metaplex-foundation/umi"
 

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

const collectionAddress = publicKey("GXS28bZ2cCCvCEf4ZUYJj9KaC5GApzok1fFHV9x9hpFp"); 

const nftAddress = publicKey("6VdJUcNEBmBzaE3rjJfSeaN9X9s3f58P9nKVK6D45o7w"); 


const transaction = verifyCollectionV1(umi , {
     metadata : findMetadataPda(umi , {mint : nftAddress}),
     collectionMint : collectionAddress,
     authority : umi.identity 
})

transaction.sendAndConfirm(umi);

console.log(` nft ${nftAddress}. is verified as member of collection ${collectionAddress}! see expolorer at ${getExplorerLink("address", nftAddress , "devnet")}`)


// npx esrun verify-nft.ts