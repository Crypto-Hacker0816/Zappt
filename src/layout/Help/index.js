import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Card, IconButton, Text as PaperText } from 'react-native-paper';
import MBanner from '../../components/MBanner';
import { AuthState } from '../../context/Provider';
import s from '../../utils/styles';
import Collapsible from 'react-native-collapsible';

export default function Help() {
  const { auth } = AuthState();
  const { isAuthenticated } = auth || {};
  const [expanded, setExpanded] = useState([]);

  const faqs = [
    {
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum, lorem sed cursus feugiat, leo dolor feugiat magna, sit amet cursus ex tellus vel massa. Nunc at metus vitae odio laoreet posuere. Quisque iaculis neque eu vestibulum pretium',
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum, lorem sed cursus feugiat, leo dolor feugiat magna, sit amet cursus ex tellus vel massa. Nunc at metus vitae odio laoreet posuere. Quisque iaculis neque eu vestibulum pretium',
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum, lorem sed cursus feugiat, leo dolor feugiat magna, sit amet cursus ex tellus vel massa. Nunc at metus vitae odio laoreet posuere. Quisque iaculis neque eu vestibulum pretium',
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum, lorem sed cursus feugiat, leo dolor feugiat magna, sit amet cursus ex tellus vel massa. Nunc at metus vitae odio laoreet posuere. Quisque iaculis neque eu vestibulum pretium',
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum, lorem sed cursus feugiat, leo dolor feugiat magna, sit amet cursus ex tellus vel massa. Nunc at metus vitae odio laoreet posuere. Quisque iaculis neque eu vestibulum pretium',
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum, lorem sed cursus feugiat, leo dolor feugiat magna, sit amet cursus ex tellus vel massa. Nunc at metus vitae odio laoreet posuere. Quisque iaculis neque eu vestibulum pretium',
    },
    {
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum, lorem sed cursus feugiat, leo dolor feugiat magna, sit amet cursus ex tellus vel massa. Nunc at metus vitae odio laoreet posuere. Quisque iaculis neque eu vestibulum pretium',
    },
  ];

  const handleChange = index => {
    let newExpanded = expanded;
    if (expanded?.includes(index)) {
      newExpanded = expanded.filter(item => item !== index);
    } else {
      newExpanded = [...expanded, index];
    }
    setExpanded(newExpanded);
  };

  return (
    <ScrollView>
      <MBanner title="Help" signed={isAuthenticated} />
      <Text
        style={
          isAuthenticated ? [styles.title, styles.signedMargin] : styles.title
        }>
        Frequently Asked <Text style={styles.featured}>Questions</Text>
      </Text>
      <Text style={styles.subTitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempor non
        augue nec pulvinar.
      </Text>
      {faqs.map((faq, index) => (
        <Card key={index} style={styles.card}>
          <Pressable
            style={styles.questionWrapper}
            onPress={() => handleChange(index)}>
            <PaperText style={styles.question} variant="labelLarge">
              {faq.question}
            </PaperText>
            <IconButton
              icon={!expanded.includes(index) ? 'chevron-down' : 'chevron-up'}
              size={20}
            />
          </Pressable>
          <Collapsible collapsed={!expanded.includes(index)}>
            <PaperText style={s.mr5} variant="bodyMedium">
              {faq.content}
            </PaperText>
          </Collapsible>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 15,
    marginTop: 50,
    color: '#1c1c1f',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  signedMargin: {
    marginTop: 0,
  },
  featured: {
    color: '#1da1f2',
  },
  filter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  subTitle: {
    marginHorizontal: 15,
    fontSize: 16,
    color: '#5b5b63',
    fontWeight: '400',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 10,
  },
  questionWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  question: {
    width: '90%',
  },
});
