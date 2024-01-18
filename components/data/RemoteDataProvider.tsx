import { AnnouncementProvider, KudosOrSlobsProvider, RewardsProvider, TaskProvider, TodoProvider } from "../../contexts";


export default function RemoteDataProvider({ children }: { children: React.ReactNode }) {
    return (
        <TodoProvider>
            <AnnouncementProvider>
                <TaskProvider>
                    <RewardsProvider>
                        <KudosOrSlobsProvider>
                            {children}
                        </KudosOrSlobsProvider>
                    </RewardsProvider>
                </TaskProvider>
            </AnnouncementProvider>
        </TodoProvider>);
}