<template>
  <!-- Input to add a question we want to ask about the text -->
  <div class="flex rounded-md shadow-sm mb-4 prompt">
    <div class="relative flex flex-grow items-stretch focus-within:z-10">
      <input
        v-model="PlanChatStore.question"
        placeholder="Enter a brief description of a project you would like to plan tasks for or click an option listed below."
        class="question-input"
      />
    </div>
    <!-- Button to send text and question to OpenAI -->
    <button
      @click="sendQuestion()"
      type="button"
      class="chat-button group relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 text-sm font-semibold bg-[#1a1a21] text-green-500 ring-1 ring-inset ring-gray-300"
    >
      <span class="text-green-100 group-hover:bg-[#42b983]">submit</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 text-green-400 hover:fill-[#42b983] group-hover:bg-[#42b983]"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
        />
      </svg>
    </button>
  </div>
  <div style="display: flex">
    <div
      style="color:#AF78E5; width:100%; text-align:center; cursor:pointer; margin-bottom: 20px;"
      @click="work = dlWork; consultant = 'Dan Lang'; PlanChatStore.question = `Plan the week for Dan Lang, an agency recruitment consultant, with ${work.length} jobs and a number of candidates for each job to review`">
        Plan the week for Dan Lang an agency recruitment consultant
    </div>
    <div
    style="color:#AF78E5; width:100%; text-align:center; cursor:pointer; margin-bottom: 20px;"
    @click="work = fwWork; consultant = 'Fria West'; PlanChatStore.question = `Plan the week for Fria West, an agency recruitment consultant, with ${work.length} jobs and a number of candidates for each job to review`">
      Plan the week for Fria West an agency recruitment consultant
  </div>
  </div>
  <pre v-if="false">{{ project }}</pre>
  <article v-if="PlanChatStore.gptResponse">
    <div style="font-size: 20px; background:none; color: blue; position:relative; top: -19px; float:right">
      {{ consultant }}
    </div>
    <h2 v-html="project.project_name"></h2>
    <ol>
      <li
        v-for="item in project.tasks"
        :key="item.task_id"
        @click="changeStatus(item)"
        :class="{ 'del' : item.task_status === 'Completed'}"
        style="cursor:pointer"
        :title="item.task_description">
        {{ item.task_name }}
        <div style="font-size: 14px;background:none">{{ item.task_description }}</div>
      </li>
    </ol>
  </article>
  <section v-if="!PlanChatStore.gptResponse && showSpinner">
    <div>
      <div class="loading">
    <div class="bounceball"></div>
    <div class="text">PROCESSING DATA</div>
  </div>
        <span style="font-size: 1.9em; color: #fbae17; padding-left: 30px;text-align: center; max-width:400px">This may take a couple of minutes to complete.</span>
    </div>
  </section>
</template>
<script setup>
import { usePlanChatStore } from '../stores/planChat'
import { computed, ref } from 'vue'

const
  PlanChatStore = usePlanChatStore(),
  showSpinner = ref(false);

const project = computed(() => JSON.parse(PlanChatStore.gptResponse)),
  consultant = ref(null),
  work =
    ref([]),
  dlWork =
    ref([{
        job_title: 'Project Manager',
        fee: 2000,
        hiring_manager: 'Frank Fernandes',
        phone: '01234567890',
        company: 'FRG',
        candidates: [
          {
            name: 'Derek Macrae',
            status: 'Not Reviewed',
            rating: 10
          },
          {
            name: 'Sally Smith',
            status: 'Not Reviewed',
            rating: 8
          },
          {
            name: 'John Doe',
            status: 'Not Reviewed',
            rating: 7
          },
          {
            name: 'Jane Doe',
            status: 'Not Reviewed',
            rating: 9
          },
          {
            name: 'John Smith',
            status: 'Not Reviewed',
            rating: 7
          }
        ]
      },
      {
        job_title: 'Power BI Developer',
        fee: 1500,
        hiring_manager: 'Jon Steele',
        company: 'Capita',
        phone: '1234567890',
        candidates: [
          {
            name: 'Derek Macrae',
            status: 'Not Reviewed',
            rating: 6
          },
          {
            name: 'Sue Smith',
            status: 'Not Reviewed',
            rating: 8
          },
          {
            name: 'Jack Doe',
            status: 'Interview',
            rating: 10
          }
        ]
      },
      {
        job_title: 'Data Analyst',
        fee: 2500,
        hiring_manager: 'Sue Franks',
        company: 'KTB',
        phone: '1234567890',
        candidates: [
          {
            name: 'Roderick Macrae',
            status: 'Not Reviewed',
            rating: 6
          },
          {
            name: 'Samantha Smith',
            status: 'Interview',
            rating: 8
          }        ]
      }]),
  fwWork =
    ref([{
        job_title: 'Project Manager',
        fee: 2000,
        hiring_manager: 'Samantha Smith',
        phone: '01234567890',
        company: 'IBM',
        candidates: [
          {
            name: 'Dugal Doge',
            status: 'Not Reviewed',
            rating: 10
          },
          {
            name: 'Sarah R. Smith',
            status: 'Not Reviewed',
            rating: 8
          },
          {
            name: 'John Doe',
            status: 'Not Reviewed',
            rating: 7
          },
          {
            name: 'Janet Macarthur',
            status: 'Not Reviewed',
            rating: 9
          },
          {
            name: 'William Willforce',
            status: 'Not Reviewed',
            rating: 7
          }
        ]
      },
      {
        job_title: 'CTO',
        fee: 7800,
        hiring_manager: 'Jon Steele',
        company: 'CRT',
        phone: '1234567890',
        candidates: [
          {
            name: 'Derek Macrae',
            status: 'Not Reviewed',
            rating: 6
          },
          {
            name: 'Sue Smith',
            status: 'Not Reviewed',
            rating: 8
          },
          {
            name: 'Jack Doe',
            status: 'Interview',
            rating: 10
          }
        ]
      },
      {
        job_title: 'Data Analyst',
        fee: 2500,
        hiring_manager: 'Sam Toner',
        company: 'Excel',
        phone: '1234567890',
        candidates: [
          {
            name: 'Roderick Macrae',
            status: 'Not Reviewed',
            rating: 6
          },
          {
            name: 'Samantha Smith',
            status: 'Interview',
            rating: 8
          }        ]
      }]);

const
  changeStatus = (item) => {
    console.log(item);
    PlanChatStore.changeStatus(item, item.task_status === "Not Started" ? "Completed" : "Not Started");
  }

const sendQuestion = () => {
  showSpinner.value = true;
  if(consultant.value) PlanChatStore.question = PlanChatStore.question 
    + '. Also schedule in time to liaise with the hiring manager about each job plus to maintain your CRM data'
    + '. Suggest key candidates to review for each job based on their status and rating'
    + '. Prioritise good candidates that are at interview stage to be progressed as a high rank task'
    + '. Prioritise the work on the following jobs based on the fee: '
    + JSON.stringify(work.value)
  PlanChatStore.createPrompt()
  PlanChatStore.sendPrompt()
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
changeStatus, clear
.prompt {
  margin-top: -18px;
}

.text {
  color: #fbae17;
  display: inline-block;
  margin-left: 5px;
}

.bounceball {
  position: relative;
  display: inline-block;
  height: 25x;
  width: 25px;
  padding-left:2px;
  &:before {
    position: absolute;
    content: '';
    display: block;
    top: 0;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: #fbae17;
    transform-origin: 50%;
    animation: bounce 500ms alternate infinite ease;
  }
}

@keyframes bounce {
  0% {
    top: 40px;
    height: 5px;
    border-radius: 60px 60px 20px 20px;
    transform: scaleX(2);
  }
  35% {
    height: 25px;
    border-radius: 50%;
    transform: scaleX(1);
  }
  100% {
    top: -18px;
  }
}

article {
  font-family: 'Indie Flower', 'Patrick Hand SC', 'Comic Neue', 'Comic Sans', 'Comic Sans MS', Helvetica, Arial, sans-serif;
  font-size: 5vmin;
  background: white;
  padding: 0.7em 2em 1.5em 3em;
  width: 115vmin;
  height: 150vmin;
  background: 
    /* radial-gradient(circle at 1em 50%, #000 0.3em, #0000 0.31em) 0 0 / 100% 33.3% repeat-y, */
    radial-gradient(circle at 0.4em 50%, #000 0.125em, #0000 0.135em) 0 0 / 100% 3vmin repeat-y,
    linear-gradient(90deg, #0000 2.6em, #fbb 0 2.65em, #0000 0),
    /* repeating-linear-gradient(#0000 1.965% 1.975%, rgb(224, 224, 254) 1.966% 1.976%) 100% 50% / calc(100% - 2.65em) 85% no-repeat, */
    #eee;
  border-radius: 0.05em;
  box-shadow: 
    0.1em 0.1em #ddd,
    0.065em 0.05em #fff,
    0.15em 0.15em #bbb,
    0.125em 0 0 0.15em #333,
    0.25em 0.125em 0 0.15em #000;
  transform: rotate(2deg) translate(15%, 0%);
  transform-origin: 10% 10%;
  position: relative;
  filter: drop-shadow(-0.25vmin 0.1em 0.35vmin #0002) drop-shadow(1vmin 0 1vmin #0003);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -1em;
    width: 1.5em;
    height: 100%;
    background: 
      linear-gradient(#0000 0.225em, #999 0 0.375em, #0000 0) 80% 0 / 68% 3vmin repeat-y,
      linear-gradient(25deg, #0000 0.225em, #666 0 0.35em, #0000 0) 44% 0.1% / 40% 3vmin repeat-y,
      radial-gradient(circle at 0.4em 50%, #999 0.075em, #0000 0.085em) 0 0 / 100% 3vmin repeat-y,
      radial-gradient(circle at 1.4em 50%, #999 0.075em, #0000 0.085em) 0 0 / 100% 3vmin repeat-y,

      #f000;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -1em;
    width: 1.5em;
    height: 100%;
    background: 
      linear-gradient(#0000 0.225em, #fff7 0 0.375em, #0000 0) 80% 0 / 68% 3vmin repeat-y;
    mask: 
      linear-gradient(90deg, #0000 0.4em, #000 0.6em, #0000 1.2em),
      linear-gradient(#0000 0.225em, #fff7 0.28em 0.3em, #0000 0.375em) 80% 0 / 68% 3vmin repeat-y;
    mask-composite: intersect;
  }
}

h2 {
  margin: -2px 0;
  font-size: 4.5vmin;
  white-space: pre;
  position: relative;
  color:black;
  background: none;

  &::before {
    content: "";
    position: absolute;
    width: 95%;
    height: 100%;
    background: #f003;
    background: radial-gradient(175% 100% at 50% 100%, #0000 50%, #000 51% 55%, #0000 56%);
    left: -1%;
    top: 25%;
    transform: rotate(0.25deg)
  }
}

.del {
  text-decoration-color: #f00c;
  background:none !important;
}

u {
  color:black;
  text-decoration: none;
  transform: rotate(-2deg) skew(-2deg);
  position: relative;
  display: inline-block;
  background:none !important;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 95%;
    height: 100%;
    background: #f003;
    background: radial-gradient(195% 100% at 50% 100%, #0000 50%, #000 51% 55%, #0000 56%);
    left: -1%;
    top: 30%;
    transform: rotate(0.25deg)
  }

  &::before {
    transform: rotate(1.5deg);
    left: 2%;
    top: 40%;
  }
}

li {
  background:none !important;
  font-size: 22px;
  margin-left:-9px;
}

ol {
  line-height: 3.2vmin;
  margin-top: 3.5vmin;
  color:black;
  background:none !important;
  list-style: decimal;
}
</style>