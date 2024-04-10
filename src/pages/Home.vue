<script setup lang="ts">
import {useSharedWorkspace} from '@/composables/workspaces'

const {workspaces} = useSharedWorkspace();
</script>

<template>
  <v-container fluid>

    <!-- WORKSPACES LIST -->
    <template v-if="workspaces?.length">
      <v-row>
<!--        <v-col-->
<!--          cols="12"-->
<!--          sm="6"-->
<!--          md="4"-->
<!--          xl="3"-->
<!--        >-->
<!--          <v-card-->
<!--            elevation="12"-->
<!--            link-->
<!--          >-->
<!--            <v-list>-->
<!--              <v-list-item-->
<!--                prepend-icon="mdi-plus"-->
<!--                :title="'Create a new workspace'"-->
<!--              >-->

<!--              </v-list-item>-->
<!--              <v-list-subheader>-->
<!--                Click to start a fresh workspace-->
<!--              </v-list-subheader>-->

<!--            </v-list>-->
<!--          </v-card>-->
<!--        </v-col>-->
        <v-col
          v-for="(workspace, index) in workspaces"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          xl="3"
        >
          <v-card
            elevation="12"
            :to="{name: 'Table', params: {wid: workspace.uuid}}"
          >
            <v-alert
              :text="workspace.description"
              :border-color="workspace.color"
              variant="text"
              elevation="0"
              border="top"
              prominent
              height="100px"
            >
              <template #prepend>
                <v-icon
                  :color="workspace.color"
                  :icon="'mdi-' + (workspace.icon || 'home')"
                  style="font-size: 44px; height: 44px; width: 44px;"
                >
                </v-icon>
              </template>
                <template #title>
                  {{workspace.name}}
                  <v-spacer/>
                  <v-btn
                    variant="text"
                    size="small"
                    icon="mdi-star-outline"
                    @click.prevent=""
                  ></v-btn>
                  <v-btn
                    variant="text"
                    size="small"
                    icon="mdi-dots-vertical"
                    @click.prevent=""
                  ></v-btn>
                </template>
            </v-alert>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- ONBOARDING -->
    <template v-else>
      <v-sheet
        color="transparent"
        class="d-flex flex-column align-center justify-center text-center fill-height"
        style="max-width: 25rem; margin: 0 auto"
      >
        <v-icon style="font-size: 120px;">mdi-robot-happy-outline</v-icon>
        <h1 class="display-3">
          Welcome Aboard!
        </h1>
        <p class="grey--text lighten-5 mt-2">
          Hi there! I'm your friendly setup assistant.
          Let's get started by creating your first Workspace and a new table.
          Just follow my lead!
        </p>
        <v-btn
          variant="text"
          prepend-icon="mdi-plus"
          color="primary"
          class="mt-4"
        >
          Create a new Workspace
        </v-btn>
      </v-sheet>
    </template>
  </v-container>

</template>
