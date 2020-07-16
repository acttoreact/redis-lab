# Conceptos generale de Live Objects

## Suscripción puntual desde el lado cliente

```TypeScript
const subscription = getLiveObjectSubscription<Content>(
  'contents',id, ['title', 'subtitle', 'creator.name', 'authors.name','authors.0.lastName']
);
const content = subscription.document;
console.log(`The start title is: ${content.title} (${content.subtitle})`);
subscription.onChange(() => {
  console.log(`The document is updated: ${content.title} (${content.subtitle})`);
});
await api.setDocumentTitle(id, 'Sample');;
console.log(`Now the title is: ${content.title} (${content.subtitle})`);
subscription.end();
```

## Usando hooks

```tsx
const content = useData<Content>('contents', id, ['title', 'votes']);
const [canVote,setCanVote] = useState<boolean>(true);
const onVote = async (): Promise<void> => {
  setCanVote(false);
  await api.voteForContent(id);
  setCanVote(true);
};
if (content) {
  return (
    <div>
      <h1>{content.title}</h1>
      <p>Total votes: {content.votes}</p>
      <button type="button" disabled={!canVote} onClick={onVote}>Vote</button>
    </div>
}
return <div className="loading">Loading...</div>;
```
