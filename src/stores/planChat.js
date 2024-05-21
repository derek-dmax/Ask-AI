import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useTokenizeStore } from './tokenize'

export const usePlanChatStore = defineStore('planChat', () => {
  const tokenizeStore = useTokenizeStore()
  const question = ref('')
  const prompt = ref([])
  const gptResponse = ref('')
  const isLoadingGPT = ref(false)

  function createPrompt() {
    const chatQuestion = { role: 'user', content: question.value }

    // create prompt array
    prompt.value.push(chatQuestion)
  }

  async function sendPrompt() {
    if (question.value.length === 0) {
      alert('You have not entered an instruction.')
    } else {
      isLoadingGPT.value = true
      gptResponse.value = ''
      console.log(question.value);

      const response = await fetch(
        "http://localhost:3002/api/v1/prediction/dcf3e32f-3ac7-4f34-8bcb-a64ee7c092f2",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"question": question.value + ` can you create a project name of 
            no more than 6 words, can you use UK English and return JSON (only) of the form:
            {
              'project_name: 'string',
              'tasks' : [
                {
                  'task_id': string,
                  'task_name' : string,
                  'task_status' : 'Not Started',
                  'task_description : string
                }
                `})
        }
      );
      gptResponse.value = await response.json();
      console.log(gptResponse.value);
      isLoadingGPT.value = false
      gptResponse.value = gptResponse.value.text.replaceAll("```json", "").replaceAll("```", "");
      console.log(gptResponse.value);
    }
  }

  function changeStatus(item, status) {
    item.task_status = status
  }

  function clearChat() {
    question.value = ''
    prompt.value = []
    gptResponse.value = ''
    isLoadingGPT.value = false
    tokenizeStore.tokenLength = 0
  }

  return { question, prompt, createPrompt, sendPrompt, gptResponse, isLoadingGPT, clearChat, changeStatus }
})
