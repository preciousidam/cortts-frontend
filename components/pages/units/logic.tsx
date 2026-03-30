import { Unit } from "@/types/models";
import { handleError } from "@/utilities/error";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateSignedMutation, useCreateTemplateMutation, useCreateUnitMutation, useUpdateUnitMutation } from "@/store/units/mutation";
import { FileLike } from "@/services/upload";
import { useMultipleUploadMutation, useSingleUploadMutation } from "@/store/uploads/mutation";
import { getUsers } from "@/services/user";
import { useGetUnitQuery } from "@/store/units/queries";

type Form = {
  name: string;
  amount: number;
  expected_initial_payment?: number | null;
  discount?: number | null;
  type: string;
  installment?: number | null;
  payment_plan: boolean;
  warranty_period: number;
  project_id: string;
  development_status?: Unit['development_status'];
  images?: string[] | null;
};

type TemplateForm = {
  name: string;
  file: FileLike | null;
}

type SignedDocumentForm = {
  name: string;
  file: FileLike | null;
  client_id: string;
}

const schema: yup.ObjectSchema<Form> = yup.object({
  name: yup.string().required('Unit name is required'),
  amount: yup.number().required('Unit amount is required'),
  type: yup.string().required('Unit type is required'),
  warranty_period: yup.number().required('Unit warranty period is required').positive(),
  project_id: yup.string().required('Project is required'),
  payment_plan: yup.boolean().default(false),
  development_status: yup.mixed<"not_started" | "in_progress" | "completed">().required("Development status is required").oneOf(['not_started', 'in_progress', 'completed'], 'Invalid development status'),
  discount: yup.number().notRequired(),
  images: yup.array().of(yup.string().defined()).nullable().notRequired(),
  installment: yup.number()
    .when('payment_plan', {
      is: true,
      then: schema => schema.required('Installment is required when payment plan is enabled').min(1),
      otherwise: schema => schema.notRequired()
    }),

  expected_initial_payment: yup.number()
    .nullable()
    .when('payment_plan', {
      is: true,
      then: schema => schema.required('Initial payment is required when payment plan is enabled'),
      otherwise: schema => schema.notRequired()
    })
}).required();

const templateSchema: yup.ObjectSchema<TemplateForm> = yup.object({
  name: yup.string().required('Template name is required'),
  file: yup.mixed<FileLike>().required('Template file is required'),
}).required();

export const useUnitLogic = () => {
  const { replace } = useRouter();
  const queryClient = useQueryClient();
  const {unit_id} = useLocalSearchParams<{unit_id: string}>();
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showSignedDocumentUpload, setShowSignedDocumentUpload] = useState(false);
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({
    defaultValues: {payment_plan: false},
    resolver: yupResolver(schema),
  });

  const { control: templateControl , setValue: setTemplateValue, handleSubmit: handleTemplateSubmit } = useForm<TemplateForm>({
    defaultValues: {},
    resolver: yupResolver(templateSchema),
  });

  const { mutate: uploadImages, isPending: isUploading } = useMultipleUploadMutation({
    onError(error, variables, context) {
      Toast.show({text1: 'Error uploading images', text2: handleError(error.response?.data, error.message), type: 'error'});
      // Toast.show({text1: 'Unit created successfully', text2: 'Your unit has been created.', type: 'success'});
      replace('../', { relativeToDirectory: true });
    },
  });

  const {mutate: upload, isPending: isUploadingTemplate} = useSingleUploadMutation();

  const { mutate: createUnitMutation, isPending } = useCreateUnitMutation({
    onError(error, variables, context) {
      Toast.show({text1: 'Error creating unit', text2: handleError(error.response?.data, error.message), type: 'error'})
    }
  });

  const {mutate: createTemplateMutation, isPending: isCreatingTemplate} = useCreateTemplateMutation({});
  const {mutate: createSignedMutation, isPending: isCreatingSigned} = useCreateSignedMutation({});
  const [showAssignClientForm, setShowAssignClientForm] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [showAssignAgentForm, setShowAssignAgentForm] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const { mutate: updateUnitMutation, isPending: isUpdating } = useUpdateUnitMutation(unit_id,{
    onError(error, variables, context) {
      Toast.show({text1: 'Error updating unit', text2: handleError(error.response?.data, error.message), type: 'error'})
    },
    onSuccess: () => {
      Toast.show({text1: 'Unit updated successfully', text2: 'Your unit has been updated.', type: 'success'});
      queryClient.invalidateQueries({ queryKey: ['unit', unit_id] });
    }
  });

  const createUnit = async (unitData: Form) => {
    if (isPending) {
      return;
    }
    const {images, ...data} = unitData;
    console.log(images);
    // return
    await createUnitMutation(data as Unit, {
      onSuccess: async (data) => {
        console.log(images);
        if (images) {
          await uploadImages({files: images, extra: {unit_id: data.id}}, {
            onSuccess: () => {
              Toast.show({text1: 'Unit created successfully', text2: 'Your unit has been created.', type: 'success'});
              queryClient.invalidateQueries({ queryKey: ['units'] });
              replace('../', { relativeToDirectory: true });
            }
          });
        } else {
          Toast.show({text1: 'Unit created successfully', text2: 'Your unit has been created.', type: 'success'});
          queryClient.invalidateQueries({ queryKey: ['units'] });
          replace('../', { relativeToDirectory: true });
        }
      }
    });
  };

  const uploadTemplate = async ({name, file}: TemplateForm) => {
    if (!file) {
      Toast.show({text1: 'No file selected', type: 'error'});
      return;
    }

    if (isCreatingTemplate) {
      return;
    }
    await upload({file, extra: {unit_id}}, {
      onSuccess: async (uploadData, variables, context) => {
        await createTemplateMutation({name, media_file_id: uploadData.id, unit_id}, {
          onSuccess: () => {
            Toast.show({text1: 'Template uploaded successfully', text2: 'Your template has been uploaded.', type: 'success'});
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            setTemplateValue('name', '');
            setTemplateValue('file', null);
            setShowDocumentUpload(false);
            queryClient.invalidateQueries({ queryKey: ['unit', unit_id] });
          },
          onError: (error, variables, context) => {
            Toast.show({text1: 'Error creating template', text2: handleError(error.response?.data, error.message), type: 'error'});
          }
        });
      },
      onError: (error, variables, context) => {
        Toast.show({text1: 'Error uploading file', text2: handleError(error.response?.data, error.message), type: 'error'});
      }
    });
  };

  const installment_amount = () => {
    if( !watch('amount') || !watch('installment') || !watch('discount')) {
      return 0;
    }
    const total = watch('amount') - (watch('amount') * (watch('discount') ?? 0) / 100) - (watch('expected_initial_payment') ?? 0)
    const installments = watch('installment') ?? 1
    return total / installments;
  };

  const total_amount = () => {
    const amount = watch('amount') ?? 0;
    const discount = watch('discount') ?? 0;
    setValue('expected_initial_payment', amount - (amount * discount / 100));
    return amount - (amount * discount / 100);
  }

  const handleImageUpload = (files: FileLike[] | null) => {
    if (!files || files.length === 0 || files.some(file => typeof file !== 'string')) {
      return;
    }
    // Handle file upload logic here, e.g., using a mutation to upload files
    setValue('images', files as string[]);
  }

  const loadMoreUsers = async (q = '', skip = 0, role?: string) => {
    const response = await queryClient.fetchQuery({
      queryKey: ['/users/', { q, limit: 100, skip, role }],
      queryFn: getUsers
    });

    const hasMore = response.count > skip + (response.data?.length || 0);
    const nextSkip = hasMore ? skip + 100 : skip;

    return {
      items: response.data.map((user: any) => ({ label: user.fullname, value: user.id })),
      total: response.count,
      hasMore,
      nextSkip
    };
  };

  const assignClient = async () => {
    if (isUpdating || !clientId) {
      return;
    }
    await updateUnitMutation({client_id: clientId},{
      onSuccess: () => {
        setShowAssignClientForm(false);
        setClientId(null);
      }
    });
  }
  const assignAgent = async () => {
    if (isUpdating || !agentId) {
      return;
    }
    await updateUnitMutation({agents: [{agent_id: agentId, unit_id, role: 'sales_rep'}]},{
      onSuccess: () => {
        setShowAssignAgentForm(false);
        setAgentId(null);
      }
    });
  }

  return {
    onSubmit: handleSubmit(createUnit),
    control: control as any,
    isLoading: isPending || isUploading || isUploadingTemplate || isCreatingTemplate || isUpdating || isCreatingSigned,
    watch,
    installment_amount,
    total_amount,
    handleImageUpload,
    templateControl: templateControl as any,
    setTemplateValue,
    onCreateTemplate: handleTemplateSubmit(uploadTemplate),
    setShowDocumentUpload,
    showDocumentUpload,
    setShowSignedDocumentUpload,
    showSignedDocumentUpload,
    setShowAssignClientForm,
    showAssignClientForm,
    loadMoreUsers,
    setClientId,
    clientId,
    assignClient,
    setAgentId,
    agentId,
    showAssignAgentForm,
    setShowAssignAgentForm,
    assignAgent,
  };
}

export const useUpdateUnitLogic = () => {
  const { replace } = useRouter();
  const queryClient = useQueryClient();
  const {unit_id} = useLocalSearchParams<{unit_id: string}>();
  const { unit } = useGetUnitQuery(unit_id);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showSignedDocumentUpload, setShowSignedDocumentUpload] = useState(false);
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({
    defaultValues: {payment_plan: false},
    resolver: yupResolver(schema),
  });

  const { mutate: uploadImages, isPending: isUploading } = useMultipleUploadMutation({
    onError(error, variables, context) {
      Toast.show({text1: 'Error uploading images', text2: handleError(error.response?.data, error.message), type: 'error'});
      // Toast.show({text1: 'Unit created successfully', text2: 'Your unit has been created.', type: 'success'});
      replace('../', { relativeToDirectory: true });
    },
  });

  const { mutate, isPending } = useUpdateUnitMutation(unit_id,{
    onError(error, variables, context) {
      Toast.show({text1: 'Error updating unit', text2: handleError(error.response?.data, error.message), type: 'error'})
    },
    onSuccess: () => {
      Toast.show({text1: 'Unit updated successfully', text2: 'Your unit has been updated.', type: 'success'});
      queryClient.invalidateQueries({ queryKey: ['unit', unit_id] });
    }
  });

  useEffect(() => {
    if (unit) {
      const { images, unit_agents, client, created_at, graph_data, payment_summary, sales_rep, ...data } = unit;
      control._reset(data);
    }
  }, [unit, control]);

  const updateUnit = async (unitData: Form) => {
    if (isPending) {
      return;
    }
    const {images, ...data} = unitData;
    console.log(images);
    // return
    await mutate(data as Unit, {
      onSuccess: async (data) => {
        console.log(images);
        if (images) {
          await uploadImages({files: images, extra: {unit_id: data.id}}, {
            onSuccess: () => {
              Toast.show({text1: 'Unit created successfully', text2: 'Your unit has been created.', type: 'success'});
              queryClient.invalidateQueries({ queryKey: ['units'] });
              replace('../', { relativeToDirectory: true });
            }
          });
        } else {
          Toast.show({text1: 'Unit created successfully', text2: 'Your unit has been created.', type: 'success'});
          queryClient.invalidateQueries({ queryKey: ['units'] });
          replace('../', { relativeToDirectory: true });
        }
      }
    });
  };


  const installment_amount = () => {
    if( !watch('amount') || !watch('installment') || !watch('discount')) {
      return 0;
    }
    const total = watch('amount') - (watch('amount') * (watch('discount') ?? 0) / 100) - (watch('expected_initial_payment') ?? 0)
    const installments = watch('installment') ?? 1
    return total / installments;
  };

  const total_amount = () => {
    const amount = watch('amount') ?? 0;
    const discount = watch('discount') ?? 0;
    setValue('expected_initial_payment', amount - (amount * discount / 100));
    return amount - (amount * discount / 100);
  }

  const handleImageUpload = (files: FileLike[] | null) => {
    if (!files || files.length === 0 || files.some(file => typeof file !== 'string')) {
      return;
    }
    // Handle file upload logic here, e.g., using a mutation to upload files
    setValue('images', files as string[]);
  }

  const loadMoreUsers = async (q = '', skip = 0, role?: string) => {
    const response = await queryClient.fetchQuery({
      queryKey: ['/users/', { q, limit: 100, skip, role }],
      queryFn: getUsers
    });

    const hasMore = response.count > skip + (response.data?.length || 0);
    const nextSkip = hasMore ? skip + 100 : skip;

    return {
      items: response.data.map((user: any) => ({ label: user.fullname, value: user.id })),
      total: response.count,
      hasMore,
      nextSkip
    };
  };


  return {
    onSubmit: handleSubmit(updateUnit),
    control: control as any,
    isLoading: isPending || isUploading,
    watch,
    installment_amount,
    total_amount,
    handleImageUpload,
    setShowDocumentUpload,
    showDocumentUpload,
    setShowSignedDocumentUpload,
    showSignedDocumentUpload,
    loadMoreUsers,
  };
}
