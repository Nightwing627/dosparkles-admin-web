<template>
  <v-app>
    <v-main class="overflow-hidden chat-main">
      <Toolbar />
      <v-container fluid>
        <v-row class="chat ma-4">
          <v-col cols="3" class="px-0 chat-bar pb-0">
            <v-text-field
              prepend-icon="person"
              color="black"
              label="Search contact"
              class="chat__input px-2"
            >
            </v-text-field>
            <v-list class="chat__list py-0">
              <v-list-item-group
                class="overflow-y-scroll chat__list-group"
                v-model="currentPerson"
                color="dark"
              >
                <v-list-item v-for="i of 160" :key="i">
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="`Name - ${i}`"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col cols="9" class="pa-0">
            <div class="chat-title">Test test, Admin test</div>
            <v-list class="chat-messages">
              <v-list-item-group>
                <v-list-item v-for="i of 12" :key="i">
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="'We are going to cinema?'"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-text="`March ${i} 21:58`"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
              <v-textarea rows="1" row-height="60" class="ma-4" auto-grow label="Type and hit Enter"></v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Toolbar from "@/components/Toolbar";

export default {
  data: () => ({
    currentPerson: 1,
  }),
  components: {
    Toolbar,
  },
};
</script>

<style lang="scss" scoped>
.chat {
  box-shadow: 0px 0px 12px 0px rgba(34, 60, 80, 0.2);

  &-bar {
    border-right: 1px solid rgba(34, 60, 80, 0.2);
  }

  &-main {
    max-height: 100vh;
  }

  &__list {
    &-group {
      overflow-y: scroll;
      max-height: 75vh;

      &::-webkit-scrollbar {
        width: 4px;
        max-height: 45px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 6px;
      }
    }
  }

  &__input,
  &-title,
  &-messages {
    border-bottom: 1px solid rgba(34, 60, 80, 0.2);
  }

  &-title {
    padding: 12px;
    font-weight: bold;
  }

  &-messages {
    max-height: 65vh;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 4px;
      max-height: 45px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 6px;
    }
  }
}
</style>
