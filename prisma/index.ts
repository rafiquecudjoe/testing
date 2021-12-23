import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({
  // log: [{ emit: "event", level: "query" }],
  log: [
    {
      emit: "stdout",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

// prismaClient.$on("query", (e) => {
//   console.log("Query: " + e.query + "Params: " + e.params);
// });
export default prismaClient;
