'use server'
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const getSession = () => {
  return getServerSession(authOptions)
}