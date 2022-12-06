export default interface IEventStream {
  putMessage(action: string, data: any): void;
  getPayload(event: any): object;
}
