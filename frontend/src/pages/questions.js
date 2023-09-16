import React from "react";
import Layout from "@/components/Layout";
import { Container, Typography } from "@mui/material";
import QuestionTable from "@/components/QuestionPage/QuestionTable";
import AddQuestionForm from "@/components/QuestionPage/AddQuestionForm";

const questions = [
  {
    id: 1,
    title: "Reverse a String",
    description: '<p>Write a function that reverses a string. The input string is given as an array of characters <code>s</code>.</p><br/>'
      + '<p>You must do this by modifying the input array in-place with O(1) extra memory.</p><br/>'
      + '<p>Example 1:</p><p>Input: <code>s = ["h","e","l","l","o"]</code></p><p>Output: <code>["o","l","l","e","h"]</code></p><br>'
      + '<p>Example 2:</p><p>Input: <code>s = ["H","a","n","n","a","h"]</code></p><p>Output: <code>["h","a","n","n","a","H"]</code></p><br/>'
      + '<p><ul>Constraints:</ul><li><code>1 <= s.length <= 10<sup>5</sup></code></li><li><code>s[i]</code> is a printable ascii character.</li></p>',
    categories: ["Strings", "Algorithms"],
    difficulty: "Easy"
  },
  {
    id: 2,
    title: "Linked List Cycle Detection",
    description: '<p>Given head, the head of a linked list, determine if the linked list has a cycle in it.</p><br/>'
      + '<p>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following'
      + 'the next pointer. Internally, <code>pos</code> is used to denote the index of the node that tail\'s next pointer '
      + 'is connected to. Note that <code>pos</code> is not passed as a parameter.</p><br/>'
      + '<p>Return true if there is a cycle in the linked list. Otherwise, return false.</p><br/>'
      + '<p>Example 1:</p><p>Input: <code>head = [3,2,0,-4], pos = 1</code></p><p>Output: <code>true</code></p>'
      + '<p>Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).</p><br>'
      + '<p>Example 2:</p><p>Input: <code>head = [1,2], pos = 0</code></p><p>Output: <code>true</code></p>'
      + '<p>Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.</p><br>'
      + '<p>Constraints:<ul></ul><li>The number of the nodes in the list is in the range [0, 10<sup>4</sup>].</li>'
      + '<li><code>-10<sup>5</sup> <= Node.val <= 10<sup>5</sup></code></li></p>'
      + '<li><code>pos</code> is -1 or a valid index in the linked-list.</li><br/>'
      + '<p>Follow up: Can you solve it using O(1) (i.e. constant) memory?</p>',
    categories: ["Data Structures", "Algorithms"],
    difficulty: "Easy"
  }
]

export default function QuestionPage() {
  return (
    <>
      <Layout>
        <Container
          maxWidth="xl"
          sx={{ height: '100vh', my: 2}}
        >
          <Typography
            variant="h5"
            noWrap
            component="h5"
            sx={{
              marginTop: 0,
              textAlign: 'center',
              color: (theme) => theme.palette.primary.contrastText,
              fontWeight: 'bold',
              fontSize: '30px'
            }}
          >
            Questions
          </Typography>
          <AddQuestionForm />
          <QuestionTable questions={questions} />
        </Container>
      </Layout>
    </>
  );
}