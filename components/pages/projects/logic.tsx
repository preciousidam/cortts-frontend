import { useCreateProjectMutation } from "@/store/projects/mutation";
import { Project } from "@/types/models";
import { handleError } from "@/utilities/error";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type ProjectForm = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'deleted' | 'reason_for_delete' | 'artwork_url'>;

const schema: yup.ObjectSchema<ProjectForm> = yup.object({
  name: yup.string().required('Project name is required'),
  address: yup.string().required('Project address is required'),
  purpose: yup.string().required('Project purpose is required'),
  description: yup.string().required('Project description is required'),
  num_units: yup.number().required('Total units is required').positive('Total units must be a positive number'),
}).required();

export const useProjectLogic = () => {
  const { replace } = useRouter();
  const { control, handleSubmit } = useForm<ProjectForm>({
    defaultValues: { name: '', address: '', purpose: '', description: '', num_units: 0 },
    resolver: yupResolver(schema),
  });
  const { mutate: createProjectMutation, isPending } = useCreateProjectMutation({
    onError(error, variables, context) {
      Toast.show({text1: 'Error creating project', text2: handleError(error.response?.data, error.message), type: 'error'})
    },
    onSuccess: () => {
      Toast.show({text1: 'Project created successfully', text2: 'Your project has been created.', type: 'success'});
      replace('../', { relativeToDirectory: true });
    }
  });

  const createProject = async (projectData: ProjectForm) => {
    if (isPending) {
      return;
    }
    const response = await createProjectMutation(projectData as Project);
  };

  return {
    onSubmit: handleSubmit(createProject),
    control,
    isLoading: isPending
  };
}
