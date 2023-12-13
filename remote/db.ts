import { KudosOrSlobs, Reward, Task, Todo, User } from '../models';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import { db } from '../config';

export async function fetchMembers(
  householdId: string,
  onMemberCallback: (member: User) => void
) {
  const membersRef = collection(db, 'members');
  const q = query(membersRef, where('household_id', '==', householdId));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    const data = doc.data();
    const member: User = {
      id: doc.id,
      name: data.name,
      role: data.role,
      totalPoints: data.total_points,
      currentPoints: data.current_points,
      birthday: data.birthday,
      avatarUri: data.avatar_uri,
      location: data.location
    };
    onMemberCallback(member);
  });
}

export async function fetchTasks(
  householdId: string,
  onTaskCallback: (task: Task) => void
) {
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, where('household_id', '==', householdId));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    const data = doc.data();
    const task: Task = {
      id: doc.id,
      title: data.title,
      description: data.description,
      createdAt: data.created_at.toDate(),
      creator: data.creator,
      status: data.status,
      assignee: data.assignee,
      points: data.points,
      submittedAt: data.submitted_at?.toDate(),
      submissionPhoto: data.submission_photo
    };
    onTaskCallback(task);
  });
}

export async function fetchRewards(
  householdId: string,
  onRewardCallback: (task: Reward) => void
) {
  const rewardsRef = collection(db, 'rewards');
  const q = query(rewardsRef, where('household_id', '==', householdId));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    const data = doc.data();
    const reward: Reward = {
      id: doc.id,
      title: data.title,
      description: data.description,
      createdAt: data.created_at.toDate(),
      creator: data.creator,
      status: data.status,
      points: data.points,
      recipient: data.recipient
    };
    onRewardCallback(reward);
  });
}

export async function fetchKudosSlobs(
  householdId: string,
  onKudosSlobsCallback: (kudosOrSlobs: KudosOrSlobs) => void
) {
  const kudosSlobsRef = collection(db, 'kudos_slobs');
  const q = query(kudosSlobsRef, where('household_id', '==', householdId));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    const data = doc.data();
    const kudosSlobs: KudosOrSlobs = {
      id: doc.id,
      type: data.type,
      sender: data.sender,
      receiver: data.receiver,
      message: data.message,
      timestamp: data.timestamp.toDate(),
      points: data.points
    };
    onKudosSlobsCallback(kudosSlobs);
  });
}

export async function fetchTodos(
  householdId: string,
  onTodoCallback: (todo: Todo) => void
) {
  const todosRef = collection(db, 'todos');
  const q = query(todosRef, where('household_id', '==', householdId));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    const data = doc.data();
    const todo: Todo = {
      id: doc.id,
      timestamp: data.timestamp.toDate(),
      status: data.status,
      description: data.description,
      category: data.category
    };
    onTodoCallback(todo);
  });
}

// ====================================================================================================================

export async function createTask(task: Task) {
  const tasksRef = collection(db, 'tasks');
  await setDoc(doc(tasksRef, task.id), task);
}

export async function createReward(reward: Reward) {
  const rewardsRef = collection(db, 'rewards');
  await setDoc(doc(rewardsRef, reward.id), reward);
}

export async function createKudosSlobs(kudosSlobs: KudosOrSlobs) {
  const kudosSlobsRef = collection(db, 'kudos_slobs');
  await setDoc(doc(kudosSlobsRef, kudosSlobs.id), kudosSlobs);
}

export async function createTodo(todo: Todo) {
  const todosRef = collection(db, 'todos');
  await setDoc(doc(todosRef, todo.id), todo);
}
