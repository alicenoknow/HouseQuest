import {
  Announcement,
  KudosOrSlobs,
  Reward,
  Task,
  Todo,
  User
} from '../models';
import {
  FieldValue,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../config';

export async function fetchMembers(
  householdId: string,
  onMemberCallback: (member: User) => void
) {
  const membersRef = doc(db, 'households', householdId);
  const membersSnapshot = await getDoc(membersRef);

  if (membersSnapshot.exists()) {
    const membersIds = membersSnapshot.data().members;

    membersIds.forEach(async (id: string) => {
      const memberRef = doc(db, 'members', id);
      const memberDoc = await getDoc(memberRef);

      if (memberDoc.exists()) {
        const data = memberDoc.data();
        const member: User = {
          id: id,
          displayName: data.displayName,
          role: data.role,
          totalPoints: data.total_points ?? 0,
          currentPoints: data.current_points ?? 0,
          birthday: data.birthday,
          photoUrl: data.photoUrl,
          location: data.location
        };
        onMemberCallback(member);
      }
    });
  }
}

export async function fetchTasks(
  householdId: string,
  onTaskCallback: (task: Task) => void
) {
  const tasksRef = doc(db, 'households', householdId);
  const tasksSnapshot = await getDoc(tasksRef);

  if (tasksSnapshot.exists()) {
    const tasksIds = tasksSnapshot.data().tasks;

    tasksIds.forEach(async (id: string) => {
      const taskRef = doc(db, 'tasks', id);
      const taskDoc = await getDoc(taskRef);

      if (taskDoc.exists()) {
        const data = taskDoc.data();
        const task: Task = {
          id: id,
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
      } else {
        console.log(`Task with ID ${id} does not exist.`);
      }
    });
  }
}

export async function fetchRewards(
  householdId: string,
  onRewardCallback: (task: Reward) => void
) {
  const householdsRef = doc(db, 'households', householdId);
  const rewardsSnapshot = await getDoc(householdsRef);

  if (rewardsSnapshot.exists()) {
    const rewardsIds = rewardsSnapshot.data().rewards;

    rewardsIds.forEach(async (id: string) => {
      const rewardRef = doc(db, 'rewards', id);
      const rewardDoc = await getDoc(rewardRef);

      if (rewardDoc.exists()) {
        const data = rewardDoc.data();
        const reward: Reward = {
          id: id,
          title: data.title,
          description: data.description,
          createdAt: data.created_at.toDate(),
          creator: data.creator,
          status: data.status,
          points: data.points,
          recipient: data.recipient
        };
        onRewardCallback(reward);
      } else {
        console.log(`Reward with ID ${id} does not exist.`);
      }
    });
  }
}

export async function fetchKudosSlobs(
  householdId: string,
  onKudosSlobsCallback: (kudosOrSlobs: KudosOrSlobs) => void
) {
  const kudosRef = doc(db, 'households', householdId);
  const kudosSnapshot = await getDoc(kudosRef);

  if (kudosSnapshot.exists()) {
    const kudosIds = kudosSnapshot.data().kudos;

    kudosIds.forEach(async (id: string) => {
      const kudosRef = doc(db, 'kudos', id);
      const kudosDoc = await getDoc(kudosRef);

      if (kudosDoc.exists()) {
        const data = kudosDoc.data();
        const kudosOrSlobs: KudosOrSlobs = {
          id: id,
          type: data.type,
          sender: data.sender,
          receiver: data.receiver,
          message: data.message,
          timestamp: data.timestamp.toDate(),
          points: data.points
        };
        onKudosSlobsCallback(kudosOrSlobs);
      } else {
        console.log(`Kudos or slob with ID ${id} does not exist.`);
      }
    });
  }
}

export async function fetchTodos(
  householdId: string,
  onTodoCallback: (todo: Todo) => void
) {
  const todosRef = doc(db, 'households', householdId);
  const todosSnapshot = await getDoc(todosRef);

  if (todosSnapshot.exists()) {
    const todosIds = todosSnapshot.data().todos;

    todosIds.forEach(async (id: string) => {
      const todoRef = doc(db, 'todos', id);
      const todoDoc = await getDoc(todoRef);

      if (todoDoc.exists()) {
        const data = todoDoc.data();
        const todo: Todo = {
          id: id,
          timestamp: data.timestamp.toDate(),
          status: data.status,
          description: data.description,
          category: data.category
        };
        onTodoCallback(todo);
      } else {
        console.log(`Todo with ID ${id} does not exist.`);
      }
    });
  }
}

export async function fetchAnnouncements(
  householdId: string,
  onAnnouncementCallback: (announcement: Announcement) => void
) {
  const householdsRef = doc(db, 'households', householdId);
  const announcementsSnapshot = await getDoc(householdsRef);

  if (announcementsSnapshot.exists()) {
    const announcementsIds = announcementsSnapshot.data().announcements;

    announcementsIds.forEach(async (id: string) => {
      const announcementRef = doc(db, 'announcements', id);
      const announcementDoc = await getDoc(announcementRef);

      if (announcementDoc.exists()) {
        const data = announcementDoc.data();
        const announcement: Announcement = {
          id: id,
          sender: data.sender,
          createdAt: data.created_at.toDate(),
          content: data.content,
          photoUri: data.photo_uri
        };
        onAnnouncementCallback(announcement);
      } else {
        console.log(`Announcement with ID ${id} does not exist.`);
      }
    });
  }
}

// ====================================================================================================================

export async function createTask(task: Task, householdId: string) {
  const tasksRef = collection(db, 'tasks');
  await setDoc(doc(tasksRef, task.id), task);

  const householdRef = doc(db, 'households', householdId);
  await updateDoc(householdRef, {
    tasks: arrayUnion(task.id)
  });
}

export async function createReward(reward: Reward, householdId: string) {
  const rewardsRef = collection(db, 'rewards');
  await setDoc(doc(rewardsRef, reward.id), reward);

  const householdRef = doc(db, 'households', householdId);
  await updateDoc(householdRef, {
    rewards: arrayUnion(reward.id)
  });
}

export async function createKudosSlobs(
  kudosSlobs: KudosOrSlobs,
  householdId: string
) {
  const kudosSlobsRef = collection(db, 'kudos_slobs');
  await setDoc(doc(kudosSlobsRef, kudosSlobs.id), kudosSlobs);

  const householdRef = doc(db, 'households', householdId);
  await updateDoc(householdRef, {
    kudos: arrayUnion(kudosSlobs.id)
  });
}

export async function createTodo(todo: Todo, householdId: string) {
  const todosRef = collection(db, 'todos');
  await setDoc(doc(todosRef, todo.id), todo);

  const householdRef = doc(db, 'households', householdId);
  await updateDoc(householdRef, {
    todos: arrayUnion(todo.id)
  });
}

export async function createAnnouncement(
  announcement: Announcement,
  householdId: string
) {
  const announcementsRef = collection(db, 'announcements');
  await setDoc(doc(announcementsRef, announcement.id), announcement);

  const householdRef = doc(db, 'households', householdId);
  await updateDoc(householdRef, {
    announcements: arrayUnion(announcement.id)
  });
}
