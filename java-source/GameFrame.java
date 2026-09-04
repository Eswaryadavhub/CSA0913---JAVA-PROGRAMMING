import javax.swing.JFrame;

/**
 * Main Java Swing Window Frame.
 * Hosts the GamePanel canvas and manages OS-level desktop window lifecycle.
 * Course: CSA0913 – Programming in Java.
 */
public class GameFrame extends JFrame {
    public GameFrame() {
        super("Tower Defence Game Using Java Swing with Intelligent Enemy Pathfinding");

        GameController controller = new GameController();
        GamePanel panel = new GamePanel(controller);

        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setContentPane(panel);
        this.setResizable(false);
        this.pack();
        this.setLocationRelativeTo(null); // Center window on desktop display
    }
}
