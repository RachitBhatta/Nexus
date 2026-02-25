"use client";
import { useEffect, useState } from "react"
import defaultAvatar from "@/public/defaultAvatar.svg"
import { Code2, GitBranch, UsersRound } from "lucide-react";
interface recentProjects{
    id:string,
    name:string,
    stars:string,
    description:string,
    tech:string[]
}
export const ProfilePage=()=>{
    
    const [isLoading,setIsLoading]=useState(false);
    const [biograph,setBiograph]=useState("");
    const [profilePicture,setProfilePicture]=useState(defaultAvatar);
    const [error,setError]=useState("");
    const [stats,setStats]=useState([]);
    const [recentProjects,setRecentProjects]=useState([]);
    const [skills,setSkills]=useState([]);
    const [follower,setFollower]=useState("");
    const [following,setFollowing]=useState("");
    const [country,setCountry]=useState("");
    const 
    const icons={
        Projects:<Code2 className="h-5 w-5" />,
        Contributions:<GitBranch className="h-5 w-5" />,
        TeamMembers:<UsersRound className="h-5 w-5 "/>,
    }

    useEffect(()=>{
        async function fetchData(){
            try {
                setIsLoading(true);
                setError("");
                const userRes=await fetch("/api/user");
                if(!userRes.ok){
                    throw new Error("Error in fetching data")
                }
                const userData=await userRes.json();
            } catch (error) {
                console.error("Error Fetching Data",error)
            }finally{
                setIsLoading(false)
            }
        }
        fetchData();
    },[])
    

    return(
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
            </div>
        </div>
    )
}