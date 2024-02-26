export const Screenshot = (props: { url: string }) => {
    return <>
        <img src={props.url} style={{ maxHeight: "50rem" }} />
    </>;
};