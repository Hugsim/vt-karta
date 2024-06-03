import { StopCompletion } from "./App";

type SidebarProps = {
    visited: Array<StopCompletion>;
    numStops: number;
    updateVisited: (newVisited: Array<StopCompletion>) => void;
};

export const Sidebar = ({ visited, numStops, updateVisited }: SidebarProps) => {
    const percentageDone = (100 * visited.length) / numStops;

    const onExport = async () => {
        await navigator.clipboard.writeText(JSON.stringify(visited));
    };
    const onImport = async () => {
        const contents = await navigator.clipboard.readText();
        updateVisited(JSON.parse(contents));
    };

    return (
        <div className="sidebar-container">
            <span className="sidebar-header sidebar-card">
                <span className="sidebar-header-title">Besökta</span>
                <span className="sidebar-percentage">{`${
                    visited.length
                }/${numStops} (${
                    Math.round(percentageDone * 100) / 100
                }%)`}</span>
                <span
                    className="sidebar-progressbar"
                    style={{ width: `${percentageDone}%` }}
                />
            </span>
            <span className="sidebar-buttons">
                <button onClick={onExport}>Exportera</button>
                <button onClick={onImport}>Importera</button>
            </span>

            {visited
                .sort(
                    (a, b) =>
                        new Date(b.at).getTime() - new Date(a.at).getTime()
                )
                .map((stop) => (
                    <div className="sidebar-card" key={stop.stopId}>
                        <h3>{stop.name}</h3>
                        {/* stop.at är string, inte Date :( */}
                        <p>{new Date(stop.at).toLocaleString()}</p>
                    </div>
                ))}
        </div>
    );
};
