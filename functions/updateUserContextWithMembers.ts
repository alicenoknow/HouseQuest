import { router } from "expo-router";
import { User } from "../models";
import { fetchMembers } from "../remote/db";
import { UserActionType, useUserContext } from "../contexts";


const { state, dispatch: userDispatch } = useUserContext();
const { user, householdId } = state;


const updateUserContextWithMembers = async () => {
  if (user == undefined) {
    console.log("user undefined")
    router.replace('/auth');
    return;
  }
  if (householdId == undefined) {
    console.log("household undefined")
    router.replace('/household');
    return;
  }
  await fetchMembers(householdId, (member: User) => {
      if (member.id === user.id) {
        userDispatch({
          type: UserActionType.UPDATE_USER,
          user: member,
        });
      }
      userDispatch({
        type: UserActionType.UPDATE_MEMBER,
        member,
      });
    });
  };