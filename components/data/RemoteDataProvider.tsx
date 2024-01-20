import { useEffect } from "react";
import { AnnouncementProvider, KudosOrSlobsProvider, RewardsProvider, TaskProvider, TodoProvider, UserActionType, useUserContext } from "../../contexts";
import { fetchMembers } from "../../remote/db";
import { User } from "../../models";

export default function RemoteDataProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const { state, dispatch } = useUserContext();
    const householdId = state?.householdId;

    useEffect(() => {
        householdId && fetchMembers(householdId,
            (member: User) => {
                console.log("member ", member)
                dispatch({ type: UserActionType.UPDATE_MEMBER, member })
            })
    }, [])


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
