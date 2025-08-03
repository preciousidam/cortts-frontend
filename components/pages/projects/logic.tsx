import { useCreateProjectMutation, useUpdateProjectMutation } from "@/store/projects/mutation";
import { Project } from "@/types/models";
import { handleError } from "@/utilities/error";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetProjectQuery } from "@/store/projects/queries";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

type ProjectForm = {
  name: string;
  address: string;
  purpose: string;
  description: string;
  num_units: number;
};

const schema: yup.ObjectSchema<ProjectForm> = yup.object({
  name: yup.string().required('Project name is required'),
  address: yup.string().required('Project address is required'),
  purpose: yup.string().required('Project purpose is required'),
  description: yup.string().required('Project description is required'),
  num_units: yup.number().required('Total units is required').positive('Total units must be a positive number'),
}).required();

export const useProjectLogic = () => {
  const { replace } = useRouter();
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: ['projects'] });
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

export const useUpdateProjectLogic = (id: string) => {
  const { replace } = useRouter();
  const {project, isLoading} = useGetProjectQuery(id);
  const { control, handleSubmit } = useForm<ProjectForm>({
    defaultValues: project ? {
      name: project.name,
      address: project.address,
      purpose: project.purpose,
      description: project.description,
      num_units: project.num_units,
    } : {
      name: '',
      address: '',
      purpose: '',
      description: '',
      num_units: 0,
    },
    resolver: yupResolver(schema),
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (project) {
      control._reset({
        name: project.name,
        address: project.address,
        purpose: project.purpose,
        description: project.description,
        num_units: project.num_units,
      });
    }
  }, [project, control]);

  const { mutate: createProjectMutation, isPending } = useUpdateProjectMutation(id,{
    onError(error, variables, context) {
      Toast.show({text1: 'Error updating project', text2: handleError(error.response?.data, error.message), type: 'error'})
    },
    onSuccess: () => {
      Toast.show({text1: 'Project updated successfully', text2: 'Your project has been updated.', type: 'success'});
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      replace('../', { relativeToDirectory: true });
    }
  });

  const updateProject = async (projectData: ProjectForm) => {
    if (isPending) {
      return;
    }
    const response = await createProjectMutation(projectData as Project);
  };

  return {
    onSubmit: handleSubmit(updateProject),
    control,
    isLoading: isPending
  };
}
