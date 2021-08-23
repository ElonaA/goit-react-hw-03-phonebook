import { Component } from 'react';

import { Section } from 'components/Section/Section';
import { ContactList } from 'components/ContactList/ContactList';
import  ContactForm  from 'components/ContactForm/ContactForm';
import { Filter } from 'components/Filter/Filter';

import { Inner} from './App.styled';

import toast, { Toaster } from 'react-hot-toast';
const dataId = require('shortid');


export class App extends Component {


state = {
  contacts: [],
  filter: ''
}

  componentDidMount() {
    const contacts = localStorage.getItem('Contacts');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
      const nextContacts = this.state.contacts;
      const prevContacts = prevState.contacts;

      if (nextContacts !== prevContacts) {
        localStorage.setItem('Contacts', JSON.stringify(nextContacts));
      }
    }
  
  handleChange = e => {
    this.setState({ name: e.target.value });
  };

  handleSubmit = data => {
    const { contacts } = this.state;

    if (contacts.find(({ name }) => name === data.name)) {
      toast.error(`Oh. no! ${data.name} is already exist in phonebook`);
      return;
    }
      
    this.setState(prevState => {
      return {
        contacts: [
          ...prevState.contacts,
          {
            id: dataId.generate(),
            name: data.name,
            number: data.number,
          },
        ],
      };
    });
  };

  handleFilter = filter => {
    this.setState({
      filter,
    });
  };

  handleDelete = idData => {
    this.setState(prevState => {
      return {
        contacts: prevState.contacts.filter(({ id }) => id !== idData),
      };
    });
  };

  filteredContacts () {
    const { contacts, filter } = this.state;

    return contacts.filter(data =>
      data.name.toLowerCase().includes(filter.toLowerCase()),
    );
  };
  

  render() {
   const { filter, contacts } = this.state;
    
    return (
      <Inner>
      <Section title="Phonebook">
        <ContactForm onSubmit={this.handleSubmit} />
        </Section>
   
          {contacts.length > 0 && (
        <Section title="Contacts">
            <Filter filter={filter} onChangeFilter={this.handleFilter} />
            <ContactList data={this.filteredContacts()} onDeleteButton={this.handleDelete} />
          </Section>
        )}
        <Toaster />
      </Inner>
       );
  }
}

