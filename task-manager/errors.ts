export class TaskNotFoundError extends Error
{
  constructor (name: string)
  {
    super(`Task "${ name }" not found.`);

    this.name = 'TaskNotFoundError';
  }
}