<template>
  <v-container fluid class="pa-4">
    <form-view
      ref="formView"
      :z-form="form"
    >
      <template #form>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.model.data.name"
              :error-messages="form.errors.name"
              :label="$t('placeholder.name')"
              :rules="[form.rules.required]"
              hide-details="auto"
              clearable
              required
              @input="form.errors = {}"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.model.data.title"
              :error-messages="form.errors.title"
              :label="$t('placeholder.title')"
              :rules="[form.rules.required]"
              hide-details="auto"
              clearable
              required
              @input="form.errors = {}"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.model.data.description"
              :error-messages="form.errors.description"
              :label="$t('placeholder.description')"
              :rules="[]"
              hide-details="auto"
              clearable
              @input="form.errors = {}"
            />
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              v-model="form.model.data.langlist"
              :search-input.sync="langListSearch"
              :items="langList"
              item-text="data.label"
              return-object
              :error-messages="form.errors.langlist"
              :label="$t('placeholder.langList')"
              prepend-inner-icon="mdi-account-lock"
              hide-details="auto"
              chips
              clearable
              deletable-chips
              multiple
              @input="form.errors = {}"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
      </template>
    </form-view>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import FormView from '@/views/Admin/FormView.vue';
import SiteService from '@/zemit/services/site.service';
import SiteModel from '@/zemit/model/site.model';
import LangService from '@/zemit/services/lang.service';

@Component({
  components: {
    FormView
  }
})
export default class SiteForm extends Vue {
  name = 'SiteForm';

  langList = [];
  langListSearch = '';

  relations = {
    langList: LangService,
  };

  form = {
    formView: this.$refs.formView,
    name: 'Site Form',
    model: new SiteModel(),
    service: SiteService.getInstance(),
    errors: {},
    rules: {},
    isLoading: false,
  };

  @Watch('langListSearch')
  onLangListSearch(search: string) {
    LangService.getInstance().getAll({search}).then(response => this.langList = response.data.view.list);
  }
}
</script>
