import {VNodeProps} from "vue";
import {VForm} from "vuetify/components/VForm";
import {VBtn} from "vuetify/components/VBtn";
import {VTooltip} from "vuetify/components/VTooltip";
import {VMenu} from "vuetify/components/VMenu";
import {VDataTable, VDataTableServer} from 'vuetify/components/VDataTable'

export type ExtractProps<T> = T extends new () => {$props: infer P} ? Omit<P, keyof VNodeProps> : never

export type VFormProps = ExtractProps<typeof VForm>
export type VBtnProps = ExtractProps<typeof VBtn>
export type VTooltipProps = ExtractProps<typeof VTooltip>
export type VMenuProps = ExtractProps<typeof VMenu>
export type VDataTableServerProps = ExtractProps<typeof VDataTableServer>
export type VDataTableProps = ExtractProps<typeof VDataTable>

export type InternalDataTableHeader = NonNullable<VDataTable['headers']>[number]
