import { createNft,fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired , getExplorerLink, getKeypairFromFile  } from "@solana-developers/helpers";
import { createUmi  } from "@metaplex-foundation/umi-bundle-defaults";
import {Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import {generateSigner, keypairIdentity, percentAmount} from "@metaplex-foundation/umi"
 

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

console.log("set up Umi isntance fir user")


const collectionMint = generateSigner(umi)
const transaction = await createNft(umi , {
    mint : collectionMint ,
    name : "My collection",
    symbol : "MC",
    uri : "https://...",
    sellerFeeBasisPoints : percentAmount(0),
    isCollection: true,
})
await transaction.sendAndConfirm(umi);

const createdcollectionNft = await fetchDigitalAsset(umi, collectionMint.publicKey );


console.log(` created collection ! address is ${getExplorerLink("address", createdcollectionNft.mint.publicKey , "devnet")}`)