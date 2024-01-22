import { Picker } from '@react-native-picker/picker';
import React, { useMemo, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  SectionListData,
  ActivityIndicator,
} from 'react-native';
import { Colors, Style, Spacers, Fonts } from '../../../constants';
import { Text } from '../../../components/Themed';
import { TodoActionType, useTodoContext, useUserContext } from '../../../contexts';
import { Todo, TodoCategory, TodoStatus } from '../../../models';
import { createTodo, removeTodo, updateTodo } from '../../../remote/db';
import { router } from 'expo-router';
import { verifyUser, verifyHousehold } from '../../../functions/verify';
import Icon from '../../../components/common/Icon';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TodoListItem from '../../../components/todo/TodoListItem';
import Divider from '../../../components/common/Divider';



const categories = [
  { title: TodoCategory.GENERAL, color: Colors.lightBlue },
  { title: TodoCategory.SHOPPING, color: Colors.lightGreen },
  { title: TodoCategory.SCHOOL, color: Colors.lightGrey },
  { title: TodoCategory.PET, color: Colors.yellow },
  { title: TodoCategory.OTHER, color: Colors.lightPink }
]

const Todos: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(TodoCategory.GENERAL);

  const { state, dispatch } = useTodoContext();
  const { state: userState } = useUserContext();

  const { user, householdId } = userState ?? {};

  if (!verifyUser(user)) {
    console.log('user undefined');
    router.replace('/auth');
    return;
  }

  if (!verifyHousehold(householdId)) {
    console.log('household undefined');
    router.replace('/household');
    return;
  }

  const addTodo = async () => {
    if (inputText.trim() !== '') {
      setLoading(true);
      const newTodo: Omit<Todo, 'id'> = {
        timestamp: new Date(Date.now()),
        status: TodoStatus.WAITING,
        description: inputText,
        category: selectedCategory,
      }
      const id = await createTodo(newTodo, householdId);
      dispatch({
        type: TodoActionType.ADD,
        todo: { ...newTodo, id }
      });
      setInputText('');
      setLoading(false);
    }
  };

  const markTodoAsDone = async (todo: Todo) => {
    const doneTodo = {
      ...todo,
      status: TodoStatus.DONE,
    }
    await updateTodo(doneTodo);
    dispatch({
      type: TodoActionType.DONE,
      id: doneTodo.id,
    });
  }

  const removeTodoFromList = async (todo: Todo) => {
    await removeTodo(todo.id, householdId);
    dispatch({
      type: TodoActionType.REMOVE,
      id: todo.id,
    });
  }

  const sections = useMemo(() => {
    const groupedTodos = state.todos.reduce((group: { [key: string]: Todo[] }, todo) => {
      if (!group[todo.category]) {
        group[todo.category] = [];
      }
      group[todo.category].push(todo);
      return group;
    }, {});

    return Object.keys(groupedTodos).map((category) => ({
      title: category,
      data: groupedTodos[category],
    }));
  }, [state]);

  const renderCategoryPicker = () => {
    const circleColor = categories.find(c => c.title === selectedCategory)?.color;
    return (
      <>
        <Text>Select category:</Text >
        <View style={styles.inputContainer}>
          {circleColor && <View style={[styles.pickerCircle, { backgroundColor: circleColor }]} />}
          <Picker
            style={styles.picker}
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          >
            <Picker.Item key={TodoCategory.GENERAL} label={TodoCategory.GENERAL} value={TodoCategory.GENERAL} style={styles.pickerItem} />
            <Picker.Item key={TodoCategory.SHOPPING} label={TodoCategory.SHOPPING} value={TodoCategory.SHOPPING} style={styles.pickerItem} />
            <Picker.Item key={TodoCategory.SCHOOL} label={TodoCategory.SCHOOL} value={TodoCategory.SCHOOL} style={styles.pickerItem} />
            <Picker.Item key={TodoCategory.PET} label={TodoCategory.PET} value={TodoCategory.PET} style={styles.pickerItem} />
            <Picker.Item key={TodoCategory.OTHER} label={TodoCategory.OTHER} value={TodoCategory.OTHER} style={styles.pickerItem} />
          </Picker>
        </View></>);
  }

  const renderInput = () => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={(text) => setInputText(text)}
        placeholder="Add Todo..."
      />
      <TouchableOpacity onPress={addTodo} style={styles.addButton}>
        {isLoading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.addButtonText}><Icon name="add-outline" color={Colors.white} /></Text>}
      </TouchableOpacity>
    </View>)

  const renderSectionHeader = ({ section: { title } }: { section: SectionListData<Todo> }) => {
    const circleColor = categories.find(c => c.title === title)?.color;
    return (
      <View style={styles.inputContainer}>
        {circleColor && <View style={[styles.pickerCircle, { backgroundColor: circleColor }]} />}
        <Text style={styles.sectionHeader}>{title}</Text>
      </View>
    )
  }

  const renderItem = ({ item }: { item: Todo }) => {
    const color = categories.find(c => c.title == item.category)?.color ?? Colors.lightBlue;
    return <TodoListItem key={item.id} todo={item} color={color} onDelete={removeTodoFromList} onComplete={markTodoAsDone} />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {renderCategoryPicker()}
      {renderInput()}
      <Divider marginX={Spacers.medium} marginY={Spacers.medium} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacers.medium,
    paddingTop: Spacers.xLarge,
  },
  inputContainer: {
    width: "100%",
    flexDirection: 'row',
    marginBottom: Spacers.medium,
    alignItems: 'center',
    borderRadius: Style.largeRadius,
  },
  picker: {
    flex: 1,
  },
  pickerItem: {
    fontSize: Fonts.medium,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    marginRight: Spacers.medium,
    padding: Spacers.medium,
    borderRadius: Style.largeRadius,
    height: 40,
  },
  addButton: {
    backgroundColor: Colors.darkGreen,
    borderRadius: Style.radius,
    padding: Spacers.small,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  todoItem: {
    borderWidth: 1,
    backgroundColor: Colors.white,
    marginBottom: Spacers.small,
    padding: Spacers.small,
    borderRadius: Style.radius,
  },
  sectionHeader: {
    fontSize: Fonts.medium,
    fontWeight: 'bold',
    paddingVertical: Spacers.small,
    paddingHorizontal: Spacers.small,
    alignSelf: 'center',
  },
  pickerCircle: {
    width: 30,
    height: 30,
    borderRadius: Style.largeRadius,
  }
});

export default Todos;
