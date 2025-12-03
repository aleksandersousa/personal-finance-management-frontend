import {
  Registration,
  RegistrationParams,
  RegistrationModel,
} from '@/domain/usecases';
import { HttpClient } from '@/data/protocols';

export class RemoteRegistration implements Registration {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async register(params: RegistrationParams): Promise<RegistrationModel> {
    const { name, email, password } = params;

    const response = await this.httpClient.post<RegistrationModel>(this.url, {
      name,
      email,
      password,
    });

    return {
      id: response.id,
      name: response.name,
      email: response.email,
      createdAt: new Date(response.createdAt),
      message: response.message,
    };
  }
}
