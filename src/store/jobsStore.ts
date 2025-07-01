import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "./authStore";

enum ApplicationStatus {
  PENDING = "pending",
  REVIEWING = "reviewing",
  SHORTLISTED = "shortlisted",
  INTERVIEW_SCHEDULED = "interviewScheduled",
  INTERVIEWED = "interviewd",
  OFFER_EXTENDED = "offerExtended",
  HIRED = "hired",
  REJECTED = "rejected",
  WITHDRAWN = "withrawn",
}

export interface Application {
  id: string;
  jobId: string;
  userId: User["id"];
  status: ApplicationStatus;
  resumeUrl: string;
  appliedAt: Date;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  advantages: string[];
  createdAt: Date;
  applications?: Application[];
}

interface JobsState {
  jobs: Job[];
  isLoading: boolean;
  isInitialized: boolean;
  setJobs: (jobs: Job[]) => void;
  createJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (jobId: Job["id"]) => void;
  initialize: () => void;
}

export const useJobsStore = create<JobsState>()(
  persist(
    (set) => ({
      jobs: [],
      isLoading: false,
      isInitialized: false,
      setJobs: (jobs: Job[]) => {
        set({ jobs });
      },
      createJob: (job: Job) => {
        set((state) => {
          return { jobs: [...state.jobs, job] };
        });
      },
      updateJob: (job: Job) => {
        set((state) => {
          const jobs = state.jobs.map((item) =>
            item.id === job.id ? { ...job } : item
          );

          return { jobs };
        });
      },
      deleteJob: (jobId: Job["id"]) => {
        set((state) => {
          const jobs = state.jobs.filter((item) => item.id !== jobId);

          return { jobs };
        });
      },
      initialize: () => {
        set({
          isInitialized: true,
          isLoading: false,
        });
      },
    }),
    {
      name: "jobs-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialize();
        }
      },
    }
  )
);
