
//params is automatically value which is pass by next js

import { ChatWrapper } from "@/components/ChatWrapper";
import { RagChat } from "../../lib/rag-chat";
import { redis } from "../../lib/redis";
import { cookies } from "next/headers";

//when w use [...folder_name] this is what automaticlly happend
interface PageProps {
    params:{
        url:string|string[]| undefined; //in the console log we get dynamic folder name not this name 
                                       //and now passes as a saparate object
    }
}

// function for reconstruction of url to like original url
function reconstructURL({url}:{url:string[]}){
    const decodedcomponent=url.map((component)=> decodeURIComponent(component));
    return decodedcomponent.join("//");
}


const Page = async ({params}: PageProps)=>{

     //adding sessions
    const sessionCookie= cookies().get("sessionId")?.value
    const reconstructedURL = reconstructURL({url: params.url as string[] });//function calling to reconstruURL
   //check this url is reconstructed or not //sismember check the member

        
    const sessionId=(reconstructURL + "--" + sessionCookie).replace(/\//g, "")
    
   
   const isAlreadyIndexed = await redis.sismember(
        "indexed-urls", reconstructedURL);
        
    const initialMessages = await RagChat.history.getMessages({amount:10, sessionId})


    if(!isAlreadyIndexed){
        //chat with reg---->upstas
        await RagChat.context.add({
            type: "html",
            source: reconstructedURL,
            config:{
                chunkOverlap:50,
                chunkSize:200
            }
        })

        await redis.sadd("indexed-urls", reconstructedURL)//ading this memeber to redis database
    }
   
   return <ChatWrapper
    sessionId={sessionId}
    initialMessages ={initialMessages }
    />;
}
export default Page;