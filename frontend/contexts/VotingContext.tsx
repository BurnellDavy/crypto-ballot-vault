"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useAccount, useChainId } from "wagmi";
import { useEncryptedVotingSystem, Vote, VoteResult } from "../hooks/useEncryptedVotingSystem";
import { EncryptedVotingSystemAddresses } from "../abi/EncryptedVotingSystemAddresses";

interface VotingContextType {
  contractAddress: string | undefined;
  votes: Vote[];
  currentVote: Vote | null;
  userVotes: Record<number, string>;
  decryptedResults: Record<number, VoteResult[]>;
  decryptedUserVotes: Record<number, number>;
  isLoading: boolean;
  message: string | undefined;
  createVote: (title: string, description: string, options: string[], durationDays: number) => Promise<number>;
  castVote: (voteId: number, optionId: number) => Promise<void>;
  decryptUserVote: (voteId: number) => Promise<number>;
  decryptVoteResults: (voteId: number) => Promise<VoteResult[]>;
  loadVotes: () => Promise<void>;
  refreshVote: (voteId: number) => Promise<void>;
}

const VotingContext = createContext<VotingContextType | null>(null);

export function VotingProvider({ children }: { children: ReactNode }) {
  const chainId = useChainId();
  
  // Get contract address based on current chain
  const contractAddress = useMemo(() => {
    const chainIdStr = chainId.toString();
    const chainAddress = EncryptedVotingSystemAddresses[chainIdStr as keyof typeof EncryptedVotingSystemAddresses];
    
    if (chainAddress) {
      return chainAddress.address;
    }
    
    if (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
      return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    }
    
    return "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  }, [chainId]);

  const votingState = useEncryptedVotingSystem(contractAddress);

  return (
    <VotingContext.Provider value={votingState}>
      {children}
    </VotingContext.Provider>
  );
}

export function useVoting(): VotingContextType {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error("useVoting must be used within a VotingProvider");
  }
  return context;
}
