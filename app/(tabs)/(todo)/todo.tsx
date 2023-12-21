import { Picker } from '@react-native-picker/picker';
import React, { useReducer, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  SectionList,
  StyleSheet,
} from 'react-native';
import Colors from '../../../constants/Colors';
import Style from '../../../constants/Style';
import Spacers from '../../../constants/Spacers';
import { Text } from '../../../components/Themed';

// TODO refactor, basically rewrite, extract components, fix styling

interface TodoItem {
  id: string;
  text: string;
  category: string;
}


const Todo: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [todos, setTodos] = useState<TodoItem[]>([]);


  const addTodo = () => {
    if (inputText.trim() !== '') {
      const newTodo: TodoItem = {
        id: Math.random().toString(),
        text: inputText,
        category: selectedCategory,
      };
      setTodos([...todos, newTodo]);
      setInputText('');
    }
  };

  const removeTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const groupedTodos = todos.reduce((group: { [key: string]: TodoItem[] }, todo) => {
    if (!group[todo.category]) {
      group[todo.category] = [];
    }
    group[todo.category].push(todo);
    return group;
  }, {});

  const sections = Object.keys(groupedTodos).map((category) => ({
    title: category,
    data: groupedTodos[category],
  }));



  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Picker
          style={styles.picker}
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="General" value="General" style={{ fontSize: 14 }} />
          <Picker.Item label="Pet" value="Pet" style={{ fontSize: 14 }} />
          <Picker.Item label="School" value="School" style={{ fontSize: 14 }} />
          <Picker.Item label="Shopping" value="Shopping" style={{ fontSize: 14 }} />
        </Picker>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          placeholder="Add Todo..."
        />
        <TouchableOpacity onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => removeTodo(item.id)} style={styles.todoItem}>
            <Text>{item.text}</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,

  },
  inputContainer: {
    width: "100%",
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  picker: {
    flex: 1,
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    height: 35,
  },
  addButton: {
    backgroundColor: Colors.darkGreen,
    borderRadius: Style.radius,
    padding: Spacers.small,
    justifyContent: 'center',
    alignItems: 'center',


  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todoItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: "white",
    marginBottom: 10,
    padding: 8,
    borderRadius: 12,
    marginLeft: 4,
    marginRight: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 15,
  },
});

export default Todo;
